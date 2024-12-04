const symbols = [
    '<img src="pictures/pictures-slots/slots-bar.webp">',
    '<img src="pictures/pictures-slots/slots-blue_lemon.webp">',
    '<img src="pictures/pictures-slots/slots-cherries.webp">',
    '<img src="pictures/pictures-slots/slots-diamond.webp">',
    '<img src="pictures/pictures-slots/slots-lemon.webp">',
    '<img src="pictures/pictures-slots/slots-seven.webp">',
    '<img src="pictures/pictures-slots/slots-watermelon.webp">'
];

const jackpotAmount = 100000000;
const jackpotChance = 0.001;

let score = loadScore();
let isSpinning = false;

updateDisplay('jackpot-info', `Jackpot: ${jackpotAmount.toLocaleString()}`);
updateDisplay('score', score);

document.querySelector(".bet-button").addEventListener("click", () => {
    if (isSpinning) return;
    isSpinning = true;

    const betAmount = validateBet();
    if (betAmount === null) {
        isSpinning = false;
        return;
    }

    score -= betAmount;
    updateDisplay('score', score);

    const reelPromises = Array.from({ length: 3 }, (_, i) => spinReel(`reel${i + 1}`));
    Promise.all(reelPromises).then(() => {
        setTimeout(() => {
            checkWin(betAmount);
            isSpinning = false;
        }, 1000);
    });
});

function spinReel(reelId) {
    return new Promise((resolve) => {
        const reel = document.getElementById(reelId);
        let spinCount = 0;
        const interval = setInterval(() => {
            reel.innerHTML = getRandomSymbol();
            spinCount++;
            if (spinCount >= 10) {
                clearInterval(interval);
                reel.innerHTML = getRandomSymbol(); 
                resolve();
            }
        }, 300);
    });
}

function checkWin(betAmount) {
    const reels = Array.from(document.querySelectorAll('.reel img'));
    const firstSymbol = reels[0]?.src;
    const matchingSymbols = reels.filter(img => img.src === firstSymbol).length;
    let winnings = 0;

    if (matchingSymbols === 3) {
        winnings = betAmount * 5;
        if (Math.random() < jackpotChance) {
            winnings = jackpotAmount;
            showMessage(`Jackpot!!!!!!!!! You won: ${winnings.toLocaleString()}`);
        } else {
            showMessage(`YOU WON: ${winnings.toLocaleString()}`);
        }
    } else if (matchingSymbols === 2) {
        winnings = betAmount * 2;
        showMessage(`YOU WON: ${winnings.toLocaleString()}`);
    } else {
        showMessage("You lost! :(");
    }

    score += winnings;
    updateDisplay('score', score);
    saveScore();

    if (score <= 0) {
        showMessage("No more money! Visit Money Maker.");
    }
}

function validateBet() {
    const betAmount = parseInt(document.getElementById("bet-amount").value);
    if (isNaN(betAmount) || betAmount <= 0) {
        showMessage("Please enter a positive amount!");
        return null;
    } else if (betAmount > score) {
        showMessage("You dont have enough money.");
        return null;
    }
    return betAmount;
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function showMessage(message) {
    updateDisplay("message", message);
}

function updateDisplay(id, text) {
    document.getElementById(id).innerText = text;
}

function saveScore() {
    localStorage.setItem('score', score);
}

function loadScore() {
    return localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 100;
}

function limitInput(element) {
    if (element.value.length > 10) {
        element.value = element.value.slice(0, 10);
    }
}
