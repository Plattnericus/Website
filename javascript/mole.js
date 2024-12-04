let currMoleTile;
let currPlantTile;
let gameOver = false;
let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 100; // Get score from localStorage or set default to 100
let clickCooldown = false; // Flag to handle click cooldown
let moleInterval;
let plantInterval;

window.onload = function() {
    setGame();
    document.getElementById('score').textContent = score; // Update the score display when the page loads
}

function setGame() {
    // Clear the board and reset variables
    document.getElementById('board').innerHTML = '';
    currMoleTile = null;
    currPlantTile = null;

    for (let i = 0; i < 9; i++) { // Create 3x3 grid
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }

    // Reset intervals for mole and plant
    clearInterval(moleInterval);
    clearInterval(plantInterval);
    moleInterval = setInterval(setMole, 1000); // Set mole movement every 1 second
    plantInterval = setInterval(setPlant, 1000); // Set plant movement every 1 second
}

function getRandomTile() {
    let num = Math.floor(Math.random() * 9);
    return num.toString();
}

function setMole() {
    if (gameOver) {
        return;
    }
    if (currMoleTile) {
        currMoleTile.innerHTML = ""; // Clear the previous mole
    }
    let mole = document.createElement("img");
    mole.src = "pictures/whac-a-mole/siggidyyyy-hit.webp";

    let num = getRandomTile();
    if (currPlantTile && currPlantTile.id == num) {
        num = getRandomTile(); // Ensure mole doesn't overlap with plant
    }
    currMoleTile = document.getElementById(num);
    currMoleTile.appendChild(mole);
}

function setPlant() {
    if (gameOver) {
        return;
    }
    if (currPlantTile) {
        currPlantTile.innerHTML = ""; // Clear the previous plant
    }
    let plant = document.createElement("img");
    plant.src = "pictures/whac-a-mole/siggidyfinger-hit.webp";

    let num = getRandomTile();
    if (currMoleTile && currMoleTile.id == num) {
        num = getRandomTile(); // Ensure plant doesn't overlap with mole
    }
    currPlantTile = document.getElementById(num);
    currPlantTile.appendChild(plant);
}

function selectTile() {
    if (clickCooldown || gameOver) {
        return;
    }

    clickCooldown = true;
    setTimeout(() => {
        clickCooldown = false;
    }, 500); // 500ms cooldown

    if (this == currMoleTile) {
        score += 10;
        document.getElementById('score').textContent = score;
        localStorage.setItem('score', score);
        setMole(); // Move mole immediately after click
    } else if (this == currPlantTile) {
        showGameOver();
        gameOver = true;
    }
    
function showGameOver() {
    const overlay = document.getElementById('gameOverOverlay');
    overlay.style.display = 'flex';
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeGameOver();
        }
    });
}

function closeGameOver() {
    document.getElementById('gameOverOverlay').style.display = 'none';
}

function restart() {
    localStorage.setItem('score', score); // Save reset score
    document.getElementById('score').textContent = score; // Update score display
    gameOver = false; // Reset game state
    setGame(); // Reinitialize the game
}
}