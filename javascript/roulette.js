let score = loadScore();
updateDisplay('score', score);

let canBet = true;
let winningMessageTimeout;

document.querySelectorAll('.bet-button').forEach(button => {
    button.addEventListener('click', function () {
        if (!canBet) return;

        const betColor = this.getAttribute('data-color');
        const betAmount = validateBet();
        if (betAmount === null) return;

        canBet = false;
        updateDisplay('score', score - betAmount);
        spinRouletteWheel(betColor, betAmount);
    });
});

function spinRouletteWheel(betColor, betAmount) {
    const spinAngle = Math.floor(Math.random() * 360 + 720);
    const wheel = document.getElementById('roulette-wheel');
    const ball = document.getElementById('roulette-ball');

    wheel.style.transform = `rotate(${spinAngle}deg)`;
    ball.style.transform = `translate(-50%, -50%) rotate(${spinAngle % 360 + 360}deg) translateY(-120px)`;

    setTimeout(() => {
        const winningNumber = Math.floor(Math.random() * 37);
        const winningColor = getColor(winningNumber);

        displayResult(winningNumber, winningColor);

        if (winningColor === betColor && winningNumber !== 0) {
            updateScore(betAmount);
            showMessage("You won!");
        } else {
            updateScore(-betAmount);
            showMessage("You lost!");
        }

        setTimeout(() => resetBettingState(), 1000);
    }, 2000);
}

function validateBet() {
    const betAmount = parseInt(document.getElementById('bet-amount').value);
    if (isNaN(betAmount) || betAmount <= 0) {
        showMessage("Please enter a valid positive amount!");
        return null;
    } else if (betAmount > score) {
        showMessage("You dont have enough money.");
        return null;
    }
    return betAmount;
}

function getColor(number) {
    if (number === 0) return 'green';
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    return redNumbers.includes(number) ? 'red' : 'black';
}

function displayResult(number, color) {
    updateDisplay('result-number', number === 0 ? '0' : number);
    updateDisplay('result-color', color);
    document.getElementById('result').classList.remove('hidden');
    document.getElementById('roulette-ball').style.transform = 'translate(-50%, -50%)';
}

function showMessage(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerText = message;
    clearTimeout(winningMessageTimeout);
    winningMessageTimeout = setTimeout(() => messageDiv.innerText = '', 3000);
}

function updateScore(amount) {
    score += amount;
    updateDisplay('score', score);
    saveScore();
    if (score <= 0) showMessage("No more money! Visit Money Maker.");
}

function resetBettingState() {
    canBet = true;
    document.getElementById('result').classList.add('hidden');
}

function saveScore() {
    localStorage.setItem('score', score);
}

function loadScore() {
    return localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 100;
}

function updateDisplay(id, text) {
    document.getElementById(id).textContent = text;
}

function limitInput(element) {
    if (element.value.length > 10) {
        element.value = element.value.slice(0, 10);
    }
}

window.addEventListener('beforeunload', saveScore);
