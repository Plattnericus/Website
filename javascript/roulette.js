let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 100;
document.getElementById('score').textContent = score;

function saveScore() {
    localStorage.setItem('score', score);
}

document.querySelectorAll('.bet-button').forEach(button => {
    button.addEventListener('click', function () {
        const betColor = this.getAttribute('data-color');
        const betAmount = parseInt(document.getElementById('bet-amount').value);

        if (betAmount > score || betAmount <= 0) {
            document.getElementById("message").innerText = "You cant bet money you dont have.";
            return;
        }

        const wheel = document.getElementById('roulette-wheel');
        const ball = document.getElementById('roulette-ball');
        const rotationDegrees = Math.random() * 360 + 720;

        wheel.style.transform = 'rotate(' + rotationDegrees + 'deg)';
        
        const ballAnimationDuration = 1; 
        const ballInitialPosition = (rotationDegrees % 360) * (Math.PI / 180);
        const ballFinalPosition = ballInitialPosition + Math.PI;

        ball.style.transition = `transform ${ballAnimationDuration}s`;
        ball.style.transform = `translate(-50%, -50%) rotate(${ballFinalPosition}rad) translate(140px)`;

        setTimeout(function () {
            const resultNumber = Math.floor(Math.random() * 37); 
            document.getElementById('result-number').textContent = resultNumber;
            document.getElementById('result').classList.remove('hidden');

            const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(resultNumber);
            const isBlack = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35].includes(resultNumber);

            if (resultNumber === 0) {
                document.getElementById("message").innerText = "You lost.";
                score -= betAmount;
            } else if ((betColor === "red" && isRed) || (betColor === "black" && isBlack)) {
                document.getElementById("message").innerText = "You Won. Your Money got doubled";
                score += betAmount;
            } else {
                document.getElementById("message").innerText = "You lost.";
                score -= betAmount;
            }

            saveScore();
            document.getElementById('score').textContent = score;

            if (score <= 0) {
                document.getElementById("message").innerText = "Siggidy says you have nomore money!!! here 100$ more!";
                score += 100;
                document.getElementById('score').textContent = score;
                saveScore();

            }

            ball.style.transition = "none";
            ball.style.transform = `translate(-50%, -50%)`;
        }, 1000);
    });
});

window.addEventListener('beforeunload', function () {
    saveScore();
});
