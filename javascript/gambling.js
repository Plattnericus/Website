let dealerSum = 0;
let yourSum = 0;
let dealerAceCount = 0;
let yourAceCount = 0; 
let hidden;
let deck;
let canHit = true; 

window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();

}
let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 100;
document.getElementById('score').textContent = score;
function saveScore() {
    localStorage.setItem('score', score);
}
function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); 
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function startGame() {
    document.getElementById('score').textContent = score;

    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./pictures/cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./pictures/cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
}

function hit() {
    const betAmount = parseInt(document.getElementById("bet-amount").value);
    if (betAmount > score || betAmount <= 0) {
        document.getElementById("message").innerText = "You can't bet money you don't have.";
        return
    }
    if (!canHit) return;
    document.getElementById("bet-amount").readOnly = true;

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./pictures/cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if (reduceAce(yourSum, yourAceCount) > 21) {
        canHit = false;
        disableButtons();
        document.getElementById("message").innerText = "You lost";
        updateScore(-parseInt(document.getElementById("bet-amount").value));
        setTimeout(() => {
            document.getElementById("message").innerText = "Wait a second!";
        }, 1500);
    
        setTimeout(() => {
            location.reload();
        }, 3000);
    }

}


function stay() {
    const betAmount = parseInt(document.getElementById("bet-amount").value);
    if (betAmount > score || betAmount <= 0) {
        document.getElementById("message").innerText = "You can't bet money you don't have.";
        return;
    }
    if (canHit) {
        document.getElementById("bet-amount").readOnly = true;
    }

    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    disableButtons();
    document.getElementById("hidden").src = "./pictures/cards/" + hidden + ".png";

    let message = "";

    if (yourSum > 21) {
        document.getElementById("message").innerText = "You lost";
        updateScore(-betAmount);
    } else if (dealerSum > 21) {
        document.getElementById("message").innerText = "You Won. Your Money got doubled";
        updateScore(betAmount);
    } else if (yourSum === dealerSum) {
        document.getElementById("message").innerText = "OO looks like a TIE";
    } else if (yourSum > dealerSum) {
        document.getElementById("message").innerText = "You Won. Your Money got doubled";
        updateScore(betAmount);
    } else {
        document.getElementById("message").innerText = "You lost! :(";
        updateScore(-betAmount);
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;

    setTimeout(() => {
        document.getElementById("message").innerText = "Wait a second!";
    }, 1500);

    setTimeout(() => {
        location.reload();
    }, 3000);
}
function disableButtons() {
    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;
}


function updateScore(amount) {
    score += amount;
    document.getElementById('score').textContent = score;
    saveScore();

    if (score <= 0) {
        document.getElementById("message").innerText = "Siggidy says you have nomore money!!! You need to get some Money (go to Money maker)!";
        document.getElementById('score').textContent = score;
        saveScore();
    }
}


function getValue(card) {
    let data = card.split("-"); 
    let value = data[0];

    if (isNaN(value)) { 
        if (value === "A") return 11;
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    return card[0] === "A" ? 1 : 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}
