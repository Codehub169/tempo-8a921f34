document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas4');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('scoreDisplay4');
    const livesDisplay = document.getElementById('livesDisplay4');
    const messageDisplay = document.getElementById('gameMessageDisplay4');
    const startButton = document.getElementById('startButton4');

    // Game state variables
    let score = 0;
    let lives = 3;
    let gameRunning = false;
    let animationFrameId;

    // Paddle properties
    const paddleHeight = 10;
    const paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;
    const paddleColor = '#3498db';

    // Ball properties
    const ballRadius = 8;
    let ballX = canvas.width / 2;
    let ballY = canvas.height - 30;
    let ballDX = 2; // Ball speed X
    let ballDY = -2; // Ball speed Y
    const ballColor = '#e74c3c';

    // Brick properties
    const brickRowCount = 4;
    const brickColumnCount = 7;
    const brickWidth = 55;
    const brickHeight = 15;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;
    const brickColors = ['#2ecc71', '#f1c40f', '#e67e22', '#9b59b6'];
    let bricks = [];

    // Control flags
    let rightPressed = false;
    let leftPressed = false;

    function initBricks() {
        bricks = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1, color: brickColors[r % brickColors.length] };
            }
        }
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = paddleColor;
        ctx.fill();
        ctx.closePath();
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = ballColor;
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) {
                    const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = bricks[c][r].color;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                const b = bricks[c][r];
                if (b.status === 1) {
                    if (ballX + ballRadius > b.x && ballX - ballRadius < b.x + brickWidth && ballY + ballRadius > b.y && ballY - ballRadius < b.y + brickHeight) {
                        ballDY = -ballDY; // Reverse ball direction
                        b.status = 0; // Brick is broken
                        score++;
                        scoreDisplay.textContent = score;
                        if (checkWinCondition()) {
                            winGame();
                        }
                    }
                }
            }
        }
    }

    function checkWinCondition() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) {
                    return false; // Found an active brick, game not won yet
                }
            }
        }
        return true; // All bricks are broken
    }

    function winGame() {
        messageDisplay.textContent = 'YOU WIN! CONGRATULATIONS!';
        messageDisplay.style.color = '#2ecc71';
        gameRunning = false;
        cancelAnimationFrame(animationFrameId);
        startButton.innerHTML = '<i class="fas fa-redo"></i> Play Again?';
        startButton.style.backgroundColor = '#2ecc71';
    }

    function loseLife() {
        lives--;
        livesDisplay.textContent = lives;
        if (lives <= 0) {
            gameOver();
        } else {
            // Reset ball and paddle for next life
            ballX = canvas.width / 2;
            ballY = canvas.height - 30;
            ballDX = 2 * (Math.random() > 0.5 ? 1 : -1); // Randomize initial X direction slightly
            ballDY = -2;
            paddleX = (canvas.width - paddleWidth) / 2;
            messageDisplay.textContent = `Lost a life! ${lives} left.`;
            messageDisplay.style.color = '#e74c3c';
            setTimeout(() => { messageDisplay.textContent = ''; }, 2000);
        }
    }

    function gameOver() {
        messageDisplay.textContent = 'GAME OVER!';
        messageDisplay.style.color = '#e74c3c';
        gameRunning = false;
        cancelAnimationFrame(animationFrameId);
        startButton.innerHTML = '<i class="fas fa-redo"></i> Try Again?';
        startButton.style.backgroundColor = '#e74c3c';
    }

    function updateGame() {
        if (!gameRunning) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawBricks();
        drawPaddle();
        drawBall();
        collisionDetection();

        // Ball movement and wall collision
        if (ballX + ballDX > canvas.width - ballRadius || ballX + ballDX < ballRadius) {
            ballDX = -ballDX;
        }
        if (ballY + ballDY < ballRadius) {
            ballDY = -ballDY;
        } else if (ballY + ballDY > canvas.height - ballRadius - paddleHeight) {
            // Check if ball hits paddle
            if (ballX > paddleX && ballX < paddleX + paddleWidth) {
                ballDY = -ballDY;
                // Optional: vary angle based on where it hits paddle
                let deltaX = ballX - (paddleX + paddleWidth / 2);
                ballDX = deltaX * 0.15; 
            } else if (ballY + ballDY > canvas.height - ballRadius) {
                 // Ball missed paddle and hits bottom wall
                loseLife();
            }
        } else if (ballY + ballDY > canvas.height - ballRadius) {
            // This case should ideally be covered by the one above (hitting paddle or bottom)
            // If it reaches here, it means it passed the paddle height check but is still going down.
            loseLife();
        }

        // Paddle movement
        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        }
        if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        ballX += ballDX;
        ballY += ballDY;

        if (gameRunning) {
            animationFrameId = requestAnimationFrame(updateGame);
        }
    }

    function startGame() {
        if (gameRunning && lives > 0 && !checkWinCondition()) return; // Prevent restart if already running mid-game

        score = 0;
        lives = 3;
        scoreDisplay.textContent = score;
        livesDisplay.textContent = lives;
        messageDisplay.textContent = '';
        startButton.innerHTML = '<i class="fas fa-play"></i> Start Game'; // Or 'Restart Game' if appropriate
        startButton.style.backgroundColor = '#e74c3c';

        initBricks();
        
        // Reset ball and paddle positions
        paddleX = (canvas.width - paddleWidth) / 2;
        ballX = canvas.width / 2;
        ballY = canvas.height - 30;
        ballDX = 2;
        ballDY = -2;
        
        rightPressed = false;
        leftPressed = false;

        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        gameRunning = true;
        updateGame();
    }

    // Event Listeners
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            rightPressed = true;
        }
        if (e.key === 'Left' || e.key === 'ArrowLeft') {
            leftPressed = true;
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            rightPressed = false;
        }
        if (e.key === 'Left' || e.key === 'ArrowLeft') {
            leftPressed = false;
        }
    });

    startButton.addEventListener('click', startGame);

    // Initial draw (before game starts)
    function initialDraw(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        initBricks(); // So bricks are visible before start
        drawBricks();
        drawPaddle();
        drawBall(); // Ball in starting position
        scoreDisplay.textContent = score;
        livesDisplay.textContent = lives;
    }
    initialDraw(); 

});