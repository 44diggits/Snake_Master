// Constants
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const blockSize = 20;

// Snake variables
let snake = [{ x: 10, y: 10 }];
let dx = 0;
let dy = 0;

// Food variables
let foodX;
let foodY;

// Score
let score = 0;

// High Score
let highScore = localStorage.getItem('snakeHighScore') || 0;

// Game loop
function gameLoop() {
    clearCanvas();
    moveSnake();
    if (isCollidingWithFood()) {
        score++;
        updateHighScore();
        generateFood();
        growSnake();
        playEatSound(); // Play eat sound effect
    }
    if (isCollidingWithWall() || isCollidingWithSnake()) {
        gameOver();
        playGameOverSound(); // Play game over sound effect
        return;
    }
    drawSnake();
    drawFood();
    drawScore();
    drawHighScore(); // Draw high score
    setTimeout(gameLoop, 100);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (!isCollidingWithFood()) {
        snake.pop();
    }
}

function drawSnake() {
    snake.forEach(segment => {
        ctx.fillStyle = '#007bff'; // Blue color
        ctx.fillRect(segment.x * blockSize, segment.y * blockSize, blockSize, blockSize);
    });
}

function generateFood() {
    foodX = Math.floor(Math.random() * (canvasWidth / blockSize));
    foodY = Math.floor(Math.random() * (canvasHeight / blockSize));
}

function drawFood() {
    ctx.fillStyle = '#ff0000'; // Red color
    ctx.fillRect(foodX * blockSize, foodY * blockSize, blockSize, blockSize);
}

function isCollidingWithFood() {
    return snake[0].x === foodX && snake[0].y === foodY;
}

function isCollidingWithWall() {
    return (
        snake[0].x < 0 || snake[0].x >= canvasWidth / blockSize ||
        snake[0].y < 0 || snake[0].y >= canvasHeight / blockSize
    );
}

function isCollidingWithSnake() {
    return snake.slice(1).some(segment => segment.x === snake[0].x && segment.y === snake[0].y);
}

function growSnake() {
    // Add a new segment at the end of the snake's tail
    snake.push({});
}

function drawScore() {
    ctx.fillStyle = '#000000'; // Black color
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function drawHighScore() {
    ctx.fillStyle = '#000000'; // Black color
    ctx.font = '20px Arial';
    ctx.fillText(`High Score: ${highScore}`, 10, 60);
}

function updateHighScore() {
    if (score > highScore && score <= 500) { // Check if score is greater than current high score and less than or equal to 500
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
    }
}

function gameOver() {
    alert(`Game Over! Your score is ${score}`);
    resetGame();
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    score = 0;
    generateFood();
}

// Event listeners for arrow key controls
document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowUp':
            if (dy !== 1) { // Prevent the snake from reversing its direction
                dx = 0;
                dy = -1;
            }
            break;
        case 'ArrowDown':
            if (dy !== -1) {
                dx = 0;
                dy = 1;
            }
            break;
        case 'ArrowLeft':
            if (dx !== 1) {
                dx = -1;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            if (dx !== -1) {
                dx = 1;
                dy = 0;
            }
            break;
    }
});

// Play the eat sound effect
function playEatSound() {
    const eatSound = document.getElementById('eatSound');
    eatSound.play();
}

// Play the game over sound effect
function playGameOverSound() {
    const gameOverSound = document.getElementById('gameOverSound');
    gameOverSound.play();
}

// Start the game loop
generateFood();
gameLoop();
