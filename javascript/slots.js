const symbols = [
    '<img src="pictures/pictures-slots/slots-bar.png">',
    '<img src="pictures/pictures-slots/slots-blue_lemon.png">',
    '<img src="pictures/pictures-slots/slots-cherries.png">',
    '<img src="pictures/pictures-slots/slots-diamond.png">',
    '<img src="pictures/pictures-slots/slots-lemon.png">',
    '<img src="pictures/pictures-slots/slots-seven.png">',
    '<img src="pictures/pictures-slots/slots-watermelon.png">'
];

const jackpotAmount = 100000000; 
const jackpotChance = 0.001; 

let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 100;
document.getElementById("jackpot-info").innerText = `Jackpot: ${jackpotAmount.toLocaleString()}`;
document.getElementById("score").innerText = ` ${score}`;

let isSpinning = false;

document.querySelector(".bet-button").addEventListener("click", () => {
    if (isSpinning) return;
    isSpinning = true;

    const betAmount = parseInt(document.getElementById("bet-amount").value);
    if (betAmount > score || betAmount <= 0) {
        document.getElementById("message").innerText = "You cant bet money you dont have.";
        isSpinning = false;
        return;
    }

    score -= betAmount;
    document.getElementById("score").innerText = ` ${score}`;

    const promises = [];
    for (let i = 1; i <= 3; i++) {
        promises.push(spinReel(`reel${i}`));
    }

    Promise.all(promises).then(() => {
        setTimeout(() => {
            checkWin(betAmount);
            isSpinning = false;
        }, 1000);
    });
});

function spinReel(reelId) {
    return new Promise((resolve) => {
        const reel = document.getElementById(reelId);
        reel.innerHTML = "";

        let spinCount = 0;
        const interval = setInterval(() => {
            const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            reel.innerHTML = randomSymbol;
            spinCount++;

            reel.scrollTop = reel.scrollHeight;

            if (spinCount >= 10) {
                clearInterval(interval);

                for (let j = 0; j < 3; j++) {
                    const finalSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                    reel.innerHTML = finalSymbol;
                }
                resolve();
            }
        }, 300);
    });
}

function checkWin(betAmount) {
    const reels = document.querySelectorAll('.reel');
    const firstSymbol = reels[0].getElementsByTagName("img")[0]?.src;
    let winCount = 0;

    for (let reel of reels) {
        const images = reel.getElementsByTagName("img");
        if (images[0]?.src === firstSymbol) {
            winCount++;
        }
    }

    let winnings = 0;

    if (winCount === 3) {
        winnings = betAmount * 5;

        if (Math.random() < jackpotChance) {
            winnings = jackpotAmount;
            score += winnings;
            document.getElementById("message").innerText = `Jackpot!!!!!!!!! You won: ${winnings.toLocaleString()}`;
        } else {
            score += winnings;
            document.getElementById("message").innerText = `YOU WON: ${winnings.toLocaleString()}`;
        }
    } else if (winCount === 2) {
        winnings = betAmount * 2;
        score += winnings;
        document.getElementById("message").innerText = `YOU WON: ${winnings.toLocaleString()}`;
    } else {
        document.getElementById("message").innerText = "You lost! :(";
    }

    document.getElementById("score").innerText = ` ${score}`;

    saveScore();

    if (score <= 0) {
        document.getElementById("message").innerText = "Siggidy says you have nomore money!!! Go to Money maker to make some!";
        document.getElementById("score").innerText = ` ${score}`;
        saveScore();
    }
}

function saveScore() {
    localStorage.setItem('score', score);
}
