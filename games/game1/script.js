// Game 1: Cosmic Pathfinder
const canvas = document.getElementById('gameCanvas1');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');

let score = 0;

// Player (Spaceship)
const player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 40,
    width: 30,
    height: 30,
    color: '#00f0ff', // Neon cyan
    dx: 0,
    dy: 0,
    speed: 4
};

// Star (Collectible)
const star = {
    x: Math.random() * (canvas.width - 20) + 10,
    y: Math.random() * (canvas.height / 2) + 10, // Appear in the upper half
    size: 15,
    color: '#ffeb3b' // Neon yellow
};

// Draw Player (a simple triangle for a spaceship)
function drawPlayer() {
    ctx.beginPath();
    ctx.moveTo(player.x, player.y - player.height / 2);
    ctx.lineTo(player.x - player.width / 2, player.y + player.height / 2);
    ctx.lineTo(player.x + player.width / 2, player.y + player.height / 2);
    ctx.closePath();
    ctx.fillStyle = player.color;
    ctx.fill();
    
    // Simple thruster effect
    if (isMoving) {
        ctx.beginPath();
        ctx.moveTo(player.x - player.width / 4, player.y + player.height / 2 + 2);
        ctx.lineTo(player.x + player.width / 4, player.y + player.height / 2 + 2);
        ctx.lineTo(player.x, player.y + player.height / 2 + 8 + Math.random() * 5);
        ctx.closePath();
        ctx.fillStyle = '#ff5722'; // Orange/Red thruster
        ctx.fill();
    }
}

// Draw Star
function drawStar() {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) { // 5 points star
        ctx.lineTo(
            star.x + star.size * Math.cos((18 + i * 72) * Math.PI / 180),
            star.y + star.size * Math.sin((18 + i * 72) * Math.PI / 180)
        );
        ctx.lineTo(
            star.x + (star.size/2) * Math.cos((54 + i * 72) * Math.PI / 180),
            star.y + (star.size/2) * Math.sin((54 + i * 72) * Math.PI / 180)
        );
    }
    ctx.closePath();
    ctx.fillStyle = star.color;
    ctx.fill();
    
    // Pulsating glow for star
    ctx.shadowBlur = 10 + Math.sin(Date.now() / 200) * 5;
    ctx.shadowColor = star.color;
    ctx.fill(); // Fill again to apply shadow
    ctx.shadowBlur = 0; // Reset shadow
}

// Update player position
function movePlayer() {
    player.x += player.dx;
    player.y += player.dy;

    // Wall collision detection
    if (player.x - player.width / 2 < 0) player.x = player.width / 2;
    if (player.x + player.width / 2 > canvas.width) player.x = canvas.width - player.width / 2;
    if (player.y - player.height / 2 < 0) player.y = player.height / 2;
    if (player.y + player.height / 2 > canvas.height) player.y = canvas.height - player.height / 2;
}

// Check for collision between player and star
function checkCollision() {
    const distX = player.x - star.x;
    const distY = player.y - star.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < player.width / 2 + star.size / 2) {
        score++;
        scoreDisplay.textContent = score;
        // Relocate star
        star.x = Math.random() * (canvas.width - 20) + 10;
        star.y = Math.random() * (canvas.height / 2) + 10;
    }
}

// Clear canvas
function clearCanvas() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; // Slight trail effect with less opacity
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

let isMoving = false;
// Game loop
function update() {
    clearCanvas();
    drawStar();
    drawPlayer();
    movePlayer();
    checkCollision();
    requestAnimationFrame(update);
}

// Keyboard controls
function keyDown(e) {
    isMoving = true;
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        player.dx = player.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        player.dx = -player.speed;
    } else if (e.key === 'ArrowUp' || e.key === 'Up') {
        player.dy = -player.speed;
    } else if (e.key === 'ArrowDown' || e.key === 'Down') {
        player.dy = player.speed;
    }
}

function keyUp(e) {
    isMoving = false;
    if (
        e.key === 'ArrowRight' || e.key === 'Right' ||
        e.key === 'ArrowLeft' || e.key === 'Left' ||
        e.key === 'ArrowUp' || e.key === 'Up' ||
        e.key === 'ArrowDown' || e.key === 'Down'
    ) {
        player.dx = 0;
        player.dy = 0;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Start game
update();
