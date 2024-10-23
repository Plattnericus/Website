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

const MIN_SPAWN_DISTANCE = 300;

const keys = {};

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

    gameInterval = setInterval(() => {
        movePlayer();
        updateGame();
    }, 1000 / 60);
    spawnObstacles();
    startTimer();

    showDifficultyAlert(difficulty);
}

function setObstacleCount(difficulty) {
    switch (difficulty) {
        case "easy":
            obstacleCount = 1;
            break;
        case "medium":
            obstacleCount = 2;
            break;
        case "hard":
            obstacleCount = 2;
            break;
        case "HARDCORE":
            obstacleCount = 3;
            break;
        default:
            obstacleCount = 1;
    }
}

function setSiederSpeed(difficulty) {
    switch (difficulty) {
        case "easy":
            siggidySpeed = 1;
            break;
        case "medium":
            siggidySpeed = 2;
            break;
        case "hard":
            siggidySpeed = 3;
            break;
        case "HARDCORE":
            siggidySpeed = 4;
            break;
        default:
            siggidySpeed = 1;
    }
}

function resetGame() {
    obstacles = [];
    isGameOver = false;
    clearInterval(timer);
    document.querySelectorAll(".obstacle").forEach(obstacle => obstacle.remove());

    for (const key in keys) {
        delete keys[key];
    }

    document.querySelector('.difficulty').style.display = 'block';
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

    const playerValid = !(newRect.left < playerRect.right &&
        newRect.right > playerRect.left &&
        newRect.top < playerRect.bottom &&
        newRect.bottom > playerRect.top);

    const siggidyValid = !(newRect.left < siggidyRect.right &&
        newRect.right > siggidyRect.left &&
        newRect.top < siggidyRect.bottom &&
        newRect.bottom > siggidyRect.top);

    return playerValid && siggidyValid;
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

            do {
                x = Math.random() * (gameAreaRect.width - 30);
                y = Math.random() * (gameAreaRect.height - 30);
            } while (!isObstaclePositionValid(x, y));

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

    const playerValid = !(obstacleRect.left < playerRect.right &&
        obstacleRect.right > playerRect.left &&
        obstacleRect.top < playerRect.bottom &&
        obstacleRect.bottom > playerRect.top);

    const siggidyValid = !(obstacleRect.left < siggidyRect.right &&
        obstacleRect.right > siggidyRect.left &&
        obstacleRect.top < siggidyRect.bottom &&
        obstacleRect.bottom > siggidyRect.top);

    const playerDistance = Math.hypot(
        (playerRect.left + playerRect.width / 2) - (x + 15),
        (playerRect.top + playerRect.height / 2) - (y + 15)
    );

    const siggidyDistance = Math.hypot(
        (siggidyRect.left + siggidyRect.width / 2) - (x + 15),
        (siggidyRect.top + siggidyRect.height / 2) - (y + 15)
    );

    return playerValid && siggidyValid && playerDistance > MIN_SPAWN_DISTANCE && siggidyDistance > MIN_SPAWN_DISTANCE;
}

function updateGame() {
    moveSieder();
    checkCollision();
}

function checkCollision() {
    const playerRect = player.getBoundingClientRect();

    obstacles.forEach(obstacle => {
        const obstacleRect = obstacle.getBoundingClientRect();
        if (
            playerRect.left < obstacleRect.right &&
            playerRect.right > obstacleRect.left &&
            playerRect.top < obstacleRect.bottom &&
            playerRect.bottom > obstacleRect.top
        ) {
            gameOver();
        }
    });

    const siggidyRect = siggidy.getBoundingClientRect();
    if (
        playerRect.left < siggidyRect.right &&
        playerRect.right > siggidyRect.left &&
        playerRect.top < siggidyRect.bottom &&
        playerRect.bottom > siggidyRect.top
    ) {
        gameOver(); 
    }
}

function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
    clearInterval(timer);
    player.style.display = 'none';
    siggidy.style.display = 'none';
    obstacleCount = 0;
    
    document.querySelectorAll(".obstacle").forEach(obstacle => obstacle.remove());

    resetGame();
}

function timeUp() {
    clearInterval(gameInterval);
    clearInterval(timer);

    let message = ""; 
    switch (selectedDifficulty) {
        case "easy":
            score += 200;
            message = "Time's up! You earned 200$";
            break;
        case "medium":
            score += 1500;
            message = "Time's up! You earned 1500$";
            break;
        case "hard":
            score += 50000;
            message = "Time's up! You earned 50,000$";
            break;
        case "HARDCORE":
            score += 1000000;
            message = "Time's up! You earned 1,000,000$";
            break;
        default:
            message = "Time's up!";
            break;
    }

    saveScore();
    document.getElementById('score').textContent = score;

    alert(message);

    gameOver();
}

function saveScore() {
    localStorage.setItem('score', score);
}

function startTimer() {
    let timeLeft = 30;
    timer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            timeUp(); 
            return; 
        }
        document.getElementById('timer').textContent = 'Time: ' + timeLeft + 's'; // Update display with 's'
    }, 1000);
}
function showDifficultyAlert(difficulty) {
    switch (difficulty) {
        case "easy":
            alert("You selected EASY mode. Good luck!");
            break;
        case "medium":
            alert("You selected MEDIUM mode. Challenge accepted!");
            break;
        case "hard":
            alert("You selected HARD mode. Prepare for a tough fight!");
            break;
        case "HARDCORE":
            alert("You selected HARDCORE mode. Only the brave dare!");
            break;
        default:
            alert("You selected an unknown mode.");
    }
}
