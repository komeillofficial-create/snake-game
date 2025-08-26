const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake, direction, food, score, game, speed;
let highScore = localStorage.getItem("snakeHighScore") || 0;
let isPaused = false;

// صداها
const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");

document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("pauseBtn").addEventListener("click", togglePause);

function startGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = null;
    score = 0;
    speed = 150;
    food = randomFood();
    updateScore();

    if (game) clearInterval(game);
    game = setInterval(draw, speed);
}

function togglePause() {
    if (!game) return;
    isPaused = !isPaused;
}

function randomFood() {
    return {
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box
    };
}

document.addEventListener("keydown", setDirection);

function setDirection(event) {
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

function updateScore() {
    document.getElementById("score").innerText =
        "امتیاز: " + score + " | رکورد: " + highScore;
}

function draw() {
    if (isPaused) return;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "#00ff88" : "#ffffff";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "#111";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        eatSound.play();
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("snakeHighScore", highScore);
        }
        updateScore();
        food = randomFood();

        if (score % 5 === 0 && speed > 50) {
            clearInterval(game);
            speed -= 10;
            game = setInterval(draw, speed);
        }
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (
        snakeX < 0 || snakeY < 0 ||
        snakeX >= canvas.width || snakeY >= canvas.height ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
        gameOverSound.play();
        alert("💀 بازی تمام شد! امتیاز: " + score);
        return;
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    return array.some(part => head.x === part.x && head.y === part.y);
}
