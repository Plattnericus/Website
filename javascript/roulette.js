let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 100;
document.getElementById('score').textContent = score;

function saveScore() {
    localStorage.setItem('score', score);
}

let canBet = true;
let winningMessageTimeout;

document.querySelectorAll('.bet-button').forEach(button => {
    button.addEventListener('click', function () {
        if (!canBet) return;

        const betColor = this.getAttribute('data-color');
        const betAmount = parseInt(document.getElementById('bet-amount').value);

        if (betAmount > score || betAmount <= 0) {
            document.getElementById("message").innerText = "You can't bet money you don't have. (Go to Money maker to get some!!)";
            return;
        }

        canBet = false;

        const wheel = document.getElementById('roulette-wheel');
        const ball = document.getElementById('roulette-ball');
        const resultDiv = document.getElementById('result');
        const resultNumber = document.getElementById('result-number');
        const resultColor = document.getElementById('result-color');
        const messageDiv = document.getElementById('message');

        const spinAngle = Math.floor(Math.random() * 360 + 720);
        wheel.style.transform = `rotate(${spinAngle}deg)`;

        const ballSpinAngle = spinAngle % 360 + 360;
        ball.style.transform = `translate(-50%, -50%) rotate(${ballSpinAngle}deg) translateY(-120px)`;

        setTimeout(() => {
            const winningNumber = Math.floor(Math.random() * 37);
            const winningColor = getColor(winningNumber);
            resultNumber.textContent = winningNumber === 0 ? '0' : winningNumber;
            resultColor.textContent = winningColor;
            resultDiv.classList.remove('hidden');

            if ((winningColor === betColor) && (winningNumber !== 0)) {
                score += betAmount;
                messageDiv.innerText = "You won!";
                clearTimeout(winningMessageTimeout);
                winningMessageTimeout = setTimeout(() => {
                    messageDiv.innerText = '';
                }, 3000);
            } else {
                score -= betAmount;
                messageDiv.innerText = "You lost!";
            }

            saveScore();
            document.getElementById('score').textContent = score;

            ball.style.transform = 'translate(-50%, -50%)';

            setTimeout(() => {
                canBet = true; 
            }, 1000);

        }, 2000);

    });
});

function getColor(number) {
    if (number === 0) return 'green';
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    return redNumbers.includes(number) ? 'red' : 'black';
}

window.addEventListener('beforeunload', function () {
    saveScore();
});
