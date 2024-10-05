// Punkte initialisieren und aus Local Storage abrufen
let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 100;
document.getElementById('score').textContent = score;

// Funktion, um die Punkte zu speichern
function saveScore() {
    localStorage.setItem('score', score);
}

// Funktion zum Drehen des Roulette-Rads
document.querySelectorAll('.bet-button').forEach(button => {
    button.addEventListener('click', function () {
        const betColor = this.getAttribute('data-color');
        const betAmount = parseInt(document.getElementById('bet-amount').value);

        if (betAmount > score || betAmount <= 0) {
            alert("Ungültiger Einsatz! Bitte geben Sie einen Betrag ein, der kleiner oder gleich Ihren Punkten ist.");
            return;
        }

        // Roulette-Rad drehen
        const wheel = document.getElementById('roulette-wheel');
        const ball = document.getElementById('roulette-ball');
        const rotationDegrees = Math.random() * 360 + 720; // Zufällige Drehung

        wheel.style.transform = 'rotate(' + rotationDegrees + 'deg)';
        
        // Ball-Animation vorbereiten
        const ballAnimationDuration = 1; // Sekunden
        const ballInitialPosition = (rotationDegrees % 360) * (Math.PI / 180); // Startwinkel in Bogenmaß
        const ballFinalPosition = ballInitialPosition + Math.PI; // Endwinkel

        ball.style.transition = `transform ${ballAnimationDuration}s`; // Dauer des Balls
        ball.style.transform = `translate(-50%, -50%) rotate(${ballFinalPosition}rad) translate(140px)`;

        // Ergebnis nach 1 Sekunde anzeigen
        setTimeout(function () {
            const resultNumber = Math.floor(Math.random() * 37); // Ergebnisse von 0 bis 36
            document.getElementById('result-number').textContent = resultNumber;
            document.getElementById('result').classList.remove('hidden');

            // Gewinne oder Verluste bestimmen
            const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(resultNumber);
            const isBlack = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35].includes(resultNumber);

            if (resultNumber === 0) {
                alert("Sie haben verloren! Ihr Einsatz ist verloren.");
                score -= betAmount;
            } else if ((betColor === "red" && isRed) || (betColor === "black" && isBlack)) {
                alert("Sie haben gewonnen! Ihr Einsatz wird verdoppelt.");
                score += betAmount;
            } else {
                alert("Sie haben verloren! Ihr Einsatz ist verloren.");
                score -= betAmount;
            }

            // Punkte speichern und aktualisieren
            saveScore();
            document.getElementById('score').textContent = score;

            // Überprüfen, ob der Spieler keine Punkte mehr hat
            if (score <= 0) {
                alert("Sie sind Pleite! Sie sind ein Looser!!\ngehen Sie sterben             ~Siggidy");
                score += 100;
                document.getElementById('score').textContent = score;
                saveScore();

            }

            // Ball zurücksetzen
            ball.style.transition = "none"; // Entferne die Animation
            ball.style.transform = `translate(-50%, -50%)`; // Zurück zur Startposition
        }, 1000); // 1 Sekunde warten, bis das Ergebnis angezeigt wird
    });
});

// Neue Punkte hinzufügen, wenn die Seite verlassen wird
window.addEventListener('beforeunload', function () {
    saveScore();
});
