// Game 2: Aqua Harmony
const canvas2 = document.getElementById('gameCanvas2');
const ctx2 = canvas2.getContext('2d');
const scoreDisplay2 = document.getElementById('scoreDisplay2');

let score2 = 0;

// Player (Fish)
const player2 = {
    x: canvas2.width / 2 - 20,
    y: canvas2.height / 2 - 15,
    width: 40,
    height: 30,
    color: '#ff9933', // Orange fish
    dx: 0,
    dy: 0,
    speed: 3,
    facingRight: true
};

// Pearl (Collectible)
const pearls = [];
const numPearls = 5;

function initPearls() {
    pearls.length = 0; // Clear existing pearls before re-initializing
    for (let i = 0; i < numPearls; i++) {
        pearls.push({
            x: Math.random() * (canvas2.width - 20) + 10,
            y: Math.random() * (canvas2.height - 20) + 10,
            size: 8,
            color: '#f0f0f0', // Shimmering white/silver
            glowColor: '#add8e6' // Light blue glow
        });
    }
}

// Draw Player (Fish - simple oval shape with a tail)
function drawPlayer2() {
    ctx2.fillStyle = player2.color;
    ctx2.beginPath();
    // Body
    ctx2.ellipse(player2.x, player2.y, player2.width / 2, player2.height / 2, 0, 0, 2 * Math.PI);
    ctx2.fill();

    // Tail
    ctx2.beginPath();
    const tailX = player2.facingRight ? player2.x - player2.width / 2 : player2.x + player2.width / 2;
    const tailDirection = player2.facingRight ? -1 : 1;
    ctx2.moveTo(tailX, player2.y);
    ctx2.lineTo(tailX + tailDirection * 15, player2.y - 10);
    ctx2.lineTo(tailX + tailDirection * 15, player2.y + 10);
    ctx2.closePath();
    ctx2.fill();

    // Eye
    ctx2.fillStyle = '#000000';
    const eyeX = player2.facingRight ? player2.x + player2.width / 4 : player2.x - player2.width / 4;
    ctx2.beginPath();
    ctx2.arc(eyeX, player2.y - player2.height / 6, 3, 0, 2 * Math.PI);
    ctx2.fill();
}

// Draw Pearls
function drawPearls() {
    pearls.forEach(pearl => {
        ctx2.beginPath();
        ctx2.arc(pearl.x, pearl.y, pearl.size, 0, 2 * Math.PI);
        ctx2.fillStyle = pearl.color;
        
        // Shimmering effect
        ctx2.shadowBlur = 10 + Math.sin(Date.now() / 150 + pearl.x) * 5; // Vary shimmer per pearl
        ctx2.shadowColor = pearl.glowColor;
        ctx2.fill();
        ctx2.shadowBlur = 0; // Reset shadow
    });
}

// Update player position
function movePlayer2() {
    player2.x += player2.dx;
    player2.y += player2.dy;

    // Wall collision detection
    if (player2.x - player2.width / 2 < 0) player2.x = player2.width / 2;
    if (player2.x + player2.width / 2 > canvas2.width) player2.x = canvas2.width - player2.width / 2;
    if (player2.y - player2.height / 2 < 0) player2.y = player2.height / 2;
    if (player2.y + player2.height / 2 > canvas2.height) player2.y = canvas2.height - player2.height / 2;
}

// Check for collision between player and pearls
function checkCollisions2() {
    for (let i = pearls.length - 1; i >= 0; i--) {
        const pearl = pearls[i];
        const distX = player2.x - pearl.x;
        const distY = player2.y - pearl.y;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < player2.width / 2 + pearl.size) { // Adjusted collision radius
            score2++;
            scoreDisplay2.textContent = score2;
            pearls.splice(i, 1); // Remove collected pearl
            
            // Add a new pearl
            pearls.push({
                x: Math.random() * (canvas2.width - 20) + 10,
                y: Math.random() * (canvas2.height - 20) + 10,
                size: 8,
                color: '#f0f0f0',
                glowColor: '#add8e6'
            });
        }
    }
}

// Bubbles for background effect
const bubbles = [];
function initBubbles() {
    for(let i = 0; i < 20; i++) {
        bubbles.push({
            x: Math.random() * canvas2.width,
            y: canvas2.height + Math.random() * canvas2.height, // Start below screen
            radius: Math.random() * 3 + 1,
            speedY: Math.random() * 1 + 0.5
        });
    }
}

function drawBubbles() {
    ctx2.fillStyle = 'rgba(200, 225, 255, 0.3)';
    bubbles.forEach(bubble => {
        ctx2.beginPath();
        ctx2.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx2.fill();
        bubble.y -= bubble.speedY;
        if (bubble.y < -bubble.radius) { // Reset bubble when it goes off screen
            bubble.y = canvas2.height + bubble.radius;
            bubble.x = Math.random() * canvas2.width;
        }
    });
}

// Clear canvas (background image is set in HTML/CSS, so just clear dynamic elements)
function clearCanvas2() {
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
}

// Game loop
function update2() {
    clearCanvas2(); 
    drawBubbles();
    drawPearls();
    drawPlayer2();
    movePlayer2();
    checkCollisions2();
    requestAnimationFrame(update2);
}

// Keyboard controls
function keyDown2(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        player2.dx = player2.speed;
        player2.facingRight = true;
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        player2.dx = -player2.speed;
        player2.facingRight = false;
    } else if (e.key === 'ArrowUp' || e.key === 'Up') {
        player2.dy = -player2.speed;
    } else if (e.key === 'ArrowDown' || e.key === 'Down') {
        player2.dy = player2.speed;
    }
}

function keyUp2(e) {
    if (
        e.key === 'ArrowRight' || e.key === 'Right' ||
        e.key === 'ArrowLeft' || e.key === 'Left' ||
        e.key === 'ArrowUp' || e.key === 'Up' ||
        e.key === 'ArrowDown' || e.key === 'Down'
    ) {
        player2.dx = 0;
        player2.dy = 0;
    }
}

document.addEventListener('keydown', keyDown2);
document.addEventListener('keyup', keyUp2);

// Start game
initPearls();
initBubbles();
update2();
