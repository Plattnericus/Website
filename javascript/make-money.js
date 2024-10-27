let player;
let siggidy;
let obstacles = [];
let gameArea;
let timer;
let isGameOver = false;
let gameInterval;
let selectedDifficulty = "";
let obstacleCount = 1;
let siggidySpeed = 1;

let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 100;
document.getElementById('score').textContent = score;

const keys = {};
const rewards = {
    easy: 100,
    medium: 1000,
    hard: 10000,
    hardcore: 1000000
};

function startGame(difficulty) {
    selectedDifficulty = difficulty;
    setObstacleCount(difficulty);
    setSiederSpeed(difficulty);
    resetGame();
    
    player = document.getElementById("player");
    siggidy = document.getElementById("siggidy");
    gameArea = document.querySelector(".game-area");

    spawnCharacter(player);
    spawnCharacter(siggidy);

    player.style.display = 'inline-block';
    siggidy.style.display = 'inline-block';

    document.addEventListener("keydown", (event) => {
        keys[event.key] = true;
    });
    document.addEventListener("keyup", (event) => {
        keys[event.key] = false;
    });

    showDifficultyAlert(difficulty);

    setTimeout(() => {
        gameInterval = setInterval(() => {
            movePlayer();
            updateGame();
        }, 1000 / 60);
        spawnObstacles();
        startTimer();
    }, 3000);
}

function setObstacleCount(difficulty) {
    obstacleCount = difficulty === "HARDCORE" ? 3 : (difficulty === "hard" ? 2 : 1);
}

function setSiederSpeed(difficulty) {
    siggidySpeed = difficulty === "HARDCORE" ? 2.5 : (difficulty === "hard" ? 2 : (difficulty === "medium" ? 1.5 : 1));
}

function resetGame() {
    obstacles.forEach(obstacle => obstacle.remove());
    obstacles = [];
    isGameOver = false;
    clearInterval(gameInterval);
    clearInterval(timer);
    
    for (const key in keys) {
        delete keys[key];
    }

    document.querySelector('.difficulty').style.display = 'block';
    document.getElementById('timer').textContent = '';
    document.getElementById('score').textContent = score;
}

function spawnCharacter(character) {
    const gameAreaRect = gameArea.getBoundingClientRect();
    let x, y;
    do {
        x = Math.random() * (gameAreaRect.width - 30);
        y = Math.random() * (gameAreaRect.height - 30);
    } while (!isPositionValid(x, y, character));

    character.style.left = `${x}px`;
    character.style.top = `${y}px`;
}

function isPositionValid(x, y, character) {
    const characterRect = character.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    const siggidyRect = siggidy.getBoundingClientRect();

    const newRect = {
        left: x,
        top: y,
        right: x + characterRect.width,
        bottom: y + characterRect.height,
    };

    return !(
        (newRect.left < playerRect.right && newRect.right > playerRect.left &&
         newRect.top < playerRect.bottom && newRect.bottom > playerRect.top) ||
        (newRect.left < siggidyRect.right && newRect.right > siggidyRect.left &&
         newRect.top < siggidyRect.bottom && newRect.bottom > siggidyRect.top)
    );
}

function movePlayer() {
    const step = 5;
    let playerPos = player.getBoundingClientRect();

    if (keys["ArrowUp"] || keys["w"]) {
        if (playerPos.top - step >= gameArea.getBoundingClientRect().top) {
            player.style.top = player.offsetTop - step + "px";
        }
    }
    if (keys["ArrowDown"] || keys["s"]) {
        if (playerPos.bottom + step <= gameArea.getBoundingClientRect().bottom) {
            player.style.top = player.offsetTop + step + "px";
        }
    }
    if (keys["ArrowLeft"] || keys["a"]) {
        if (playerPos.left - step >= gameArea.getBoundingClientRect().left) {
            player.style.left = player.offsetLeft - step + "px";
        }
    }
    if (keys["ArrowRight"] || keys["d"]) {
        if (playerPos.right + step <= gameArea.getBoundingClientRect().right) {
            player.style.left = player.offsetLeft + step + "px";
        }
    }

    checkCollision();
}

function moveSieder() {
    const step = siggidySpeed;
    let siggidyPos = siggidy.getBoundingClientRect();
    let playerPos = player.getBoundingClientRect();

    if (siggidyPos.left < playerPos.left) {
        siggidy.style.left = `${siggidy.offsetLeft + step}px`;
    } else if (siggidyPos.left > playerPos.left) {
        siggidy.style.left = `${siggidy.offsetLeft - step}px`;
    }

    if (siggidyPos.top < playerPos.top) {
        siggidy.style.top = `${siggidy.offsetTop + step}px`;
    } else if (siggidyPos.top > playerPos.top) {
        siggidy.style.top = `${siggidy.offsetTop - step}px`;
    }
}

function spawnObstacles() {
    setInterval(() => {
        if (isGameOver) return;

        for (let i = 0; i < obstacleCount; i++) {
            const obstacle = document.createElement("div");
            obstacle.className = "obstacle";
            const gameAreaRect = gameArea.getBoundingClientRect();
            let x, y;

            let isValidPosition = false;
            while (!isValidPosition) {
                x = Math.random() * (gameAreaRect.width - 30);
                y = Math.random() * (gameAreaRect.height - 30);
            
                isValidPosition = isObstaclePositionValid(x, y);
            }

            obstacle.style.left = `${x}px`;
            obstacle.style.top = `${y}px`;
            gameArea.appendChild(obstacle);
            obstacles.push(obstacle);

            setTimeout(() => {
                obstacle.remove();
                obstacles = obstacles.filter(ob => ob !== obstacle);
            }, 5000);
        }
    }, 1000);
}

function isObstaclePositionValid(x, y) {
    const obstacleRect = {
        left: x,
        top: y,
        right: x + 30,
        bottom: y + 30,
    };

    const playerRect = player.getBoundingClientRect();
    const siggidyRect = siggidy.getBoundingClientRect();

    const padding = 20; 
    const distanceThreshold = 60; 

    const playerDistance = Math.sqrt(
        Math.pow((obstacleRect.left - playerRect.left), 2) + 
        Math.pow((obstacleRect.top - playerRect.top), 2)
    );
    
    const siggidyDistance = Math.sqrt(
        Math.pow((obstacleRect.left - siggidyRect.left), 2) + 
        Math.pow((obstacleRect.top - siggidyRect.top), 2)
    );

    return playerDistance > distanceThreshold && siggidyDistance > distanceThreshold; 
}



function checkCollision() {
    const playerRect = player.getBoundingClientRect();
    const siggidyRect = siggidy.getBoundingClientRect();

    if (obstacles.some(obstacle => {
        const obstacleRect = obstacle.getBoundingClientRect();
        return (obstacleRect.left < playerRect.right && obstacleRect.right > playerRect.left &&
                obstacleRect.top < playerRect.bottom && obstacleRect.bottom > playerRect.top);
    })) {
        endGame();
    }

    if (playerRect.left < siggidyRect.right && playerRect.right > siggidyRect.left &&
        playerRect.top < siggidyRect.bottom && playerRect.bottom > siggidyRect.top) {
        endGame();
    }

    moveSieder();
}

function endGame() {
    isGameOver = true;
    clearInterval(gameInterval);
    clearInterval(timer);
    obstacles.forEach(obstacle => obstacle.remove());
    obstacles = [];
    player.style.display = 'none';
    siggidy.style.display = 'none';
    showGameOverPopup();
}

function showGameOverPopup() {
    const popup = document.createElement("div");
    popup.className = "popup";
    popup.innerHTML = `
        <h2>GAME OVER</h2>
        <button class="close">X</button>
    `;
    document.body.appendChild(popup);

    const closeButton = popup.querySelector(".close");
    closeButton.addEventListener("click", () => {
        popup.remove();
        location.reload();
    });

    closeButton.focus();
}

function startTimer() {
    let timeLeft = 30;
    document.getElementById('timer').textContent = `Time: ${timeLeft}s`;

    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            showWinPopup(selectedDifficulty);
        } else {
            timeLeft--;
            document.getElementById('timer').textContent = `Time: ${timeLeft}s`;
        }
    }, 1000);
}

function showWinPopup(difficulty) {
    obstacles.forEach(obstacle => obstacle.remove());
    obstacles = [];
    player.style.display = 'none';
    siggidy.style.display = 'none';
    const money = rewards[difficulty];

    const popup = document.createElement("div");
    popup.className = "popup";
    popup.style.backgroundColor = "green";
    popup.innerHTML = `
        <h2>YOU WON ${money}$!</h2>
        <button class="close">X</button>
    `;
    document.body.appendChild(popup);

    const closeButton = popup.querySelector(".close");
    closeButton.addEventListener("click", () => {
        popup.remove();
        score += money;
        localStorage.setItem('score', score);
        document.getElementById('score').textContent = score;
        player.style.display = 'none';
        siggidy.style.display = 'none';
        obstacles.forEach(obstacle => obstacle.remove());
        obstacles = [];
        location.reload();
    });

    closeButton.focus();
}

function showDifficultyAlert(difficulty) {
    const alertBox = document.createElement("div");
    alertBox.className = "alert";
    alertBox.innerHTML = `<p>Difficulty set to: ${difficulty}</p>`;
    document.body.appendChild(alertBox);

    setTimeout(() => {
        alertBox.remove();
    }, 2000);
}
