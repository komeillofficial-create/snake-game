const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction;
let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};

let score = 0;
let highScore = 0;

// کنترل جهت
document.addEventListener("keydown", setDirection);

function setDirection(event) {
    if (event.key === "ArrowLeft" && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (event.key === "ArrowUp" && direction !== "DOWN") {
        direction = "UP";
    } else if (event.key === "ArrowRight" && direction !== "LEFT") {
        direction = "RIGHT";
    } else if (event.key === "ArrowDown" && direction !== "UP") {
        direction = "DOWN";
    }
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // کشیدن مار
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "lime" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "black";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // کشیدن غذا
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // مختصات سر مار
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    // اگر غذا خورد
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        if (score > highScore) {
            highScore = score;
        }
        document.getElementById("score").innerText = "امتیاز: " + score + " | رکورد: " + highScore;

        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        // دُم رو حذف کن
        snake.pop();
    }

    // سر جدید اضافه کن
    let newHead = { x: snakeX, y: snakeY };

    // گیم اور
    if (
        snakeX < 0 || snakeY < 0 ||
        snakeX >= canvas.width || snakeY >= canvas.height ||
        collision(newHead, snake)
    ) {
        alert("بازی تمام شد! 😢");
        snake = [{ x: 9 * box, y: 10 * box }];
        direction = null;
        score = 0;
        document.getElementById("score").innerText = "امتیاز: " + score + " | رکورد: " + highScore;
    }

    snake.unshift(newHead);
}

// برخورد با خودش
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

setInterval(draw, 100);
