let dealerSum = 0, yourSum = 0, dealerAceCount = 0, yourAceCount = 0;
let hidden, deck, canHit = true;
let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 100;

window.onload = function() {
    document.getElementById('score').textContent = score;
    buildDeck();
    shuffleDeck();
    startGame();
};

function buildDeck() {
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const types = ["C", "D", "H", "S"];
    deck = values.flatMap(value => types.map(type => `${value}-${type}`));
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function startGame() {
    updateScoreDisplay();
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    drawDealerCards();
    drawPlayerCards(2);
    setupEventListeners();
}

function setupEventListeners() {
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
}

function drawDealerCards() {
    while (dealerSum < 17) {
        const card = drawCard("dealer-cards");
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
    }
}

function drawPlayerCards(count) {
    for (let i = 0; i < count; i++) {
        const card = drawCard("your-cards");
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
    }
}

function drawCard(targetElementId) {
    const card = deck.pop();
    const cardImg = document.createElement("img");
    cardImg.src = `./pictures/cards/${card}.png`;
    document.getElementById(targetElementId).append(cardImg);
    return card;
}

function hit() {
    const betAmount = validateBet();
    if (betAmount === null || !canHit) return;

    const card = drawCard("your-cards");
    yourSum += getValue(card);
    yourAceCount += checkAce(card);

    if (reduceAce(yourSum, yourAceCount) > 21) {
        endGame("You lost", -betAmount);
    }
}

function stay() {
    const betAmount = validateBet();
    if (betAmount === null) return;

    canHit = false;
    revealDealerCard();
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    if (yourSum > 21) endGame("You lost", -betAmount);
    else if (dealerSum > 21 || yourSum > dealerSum) endGame("You won! Money doubled", betAmount);
    else if (yourSum === dealerSum) endGame("It's a tie", 0);
    else endGame("You lost", -betAmount);
}

function validateBet() {
    const betAmount = parseInt(document.getElementById("bet-amount").value);
    if (isNaN(betAmount) || betAmount <= 0) {
        showMessage("Please enter a positive number.");
        return null;
    } else if (betAmount > score) {
        showMessage("You dont have enough money.");
        return null;
    }
    document.getElementById("bet-amount").readOnly = true;
    return betAmount;
}

function revealDealerCard() {
    document.getElementById("hidden").src = `./pictures/cards/${hidden}.png`;
}

function endGame(message, scoreChange) {
    showMessage(message);
    updateScore(scoreChange);
    disableButtons();
    setTimeout(() => location.reload(), 3000);
}

function updateScore(amount) {
    score += amount;
    saveScore();
    updateScoreDisplay();
    if (score <= 0) showMessage("No more money! Visit Money Maker.");
}

function saveScore() {
    localStorage.setItem('score', score);
}

function updateScoreDisplay() {
    document.getElementById("score").textContent = score;
}

function disableButtons() {
    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;
}

function getValue(card) {
    const value = card.split("-")[0];
    return value === "A" ? 11 : isNaN(value) ? 10 : parseInt(value);
}

function checkAce(card) {
    return card.startsWith("A") ? 1 : 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}

function showMessage(text) {
    document.getElementById("message").innerText = text;
}
function limitInput(element) {
    if (element.value.length > 10) {
        element.value = element.value.slice(0, 10);
    }
}