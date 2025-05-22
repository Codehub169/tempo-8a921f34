document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas3');
    const ctx = canvas.getContext('2d');
    const messageDisplay = document.getElementById('messageDisplay3');
    const resetButton = document.getElementById('resetButton3');

    const TILE_SIZE = 40;
    const ROWS = canvas.height / TILE_SIZE;
    const COLS = canvas.width / TILE_SIZE;

    let player, maze, goal;

    // Player properties
    const playerColor = '#3498db';
    const playerSize = TILE_SIZE / 2;

    // Goal properties
    const goalColor = '#2ecc71';
    const goalSize = TILE_SIZE / 1.8;

    // Maze wall color
    const wallColor = '#333333';

    // Predefined maze layout (1 = wall, 0 = path)
    // A simple maze, can be expanded or randomized later
    const MAZE_LAYOUTS = [
        [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 1, 0, 0, 0, 1, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
            [1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ]
    ];
    let currentMazeIndex = 0;

    function initGame() {
        maze = MAZE_LAYOUTS[currentMazeIndex];
        currentMazeIndex = (currentMazeIndex + 1) % MAZE_LAYOUTS.length; // Cycle through mazes

        // Player starting position (top-left, first empty cell)
        player = { x: TILE_SIZE + playerSize / 2, y: TILE_SIZE + playerSize / 2 };
        
        // Goal position (bottom-right, last empty cell before wall)
        goal = { x: (COLS - 2) * TILE_SIZE + TILE_SIZE / 2, y: (ROWS - 2) * TILE_SIZE + TILE_SIZE / 2 };
        
        messageDisplay.textContent = '';
        draw();
    }

    function drawMaze() {
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (maze[row][col] === 1) {
                    ctx.fillStyle = wallColor;
                    ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }
            }
        }
    }

    function drawPlayer() {
        ctx.fillStyle = playerColor;
        ctx.fillRect(player.x - playerSize / 2, player.y - playerSize / 2, playerSize, playerSize);
    }

    function drawGoal() {
        ctx.fillStyle = goalColor;
        ctx.fillRect(goal.x - goalSize / 2, goal.y - goalSize / 2, goalSize, goalSize);
    }

    function draw() {
        // Clear canvas (set to light background color)
        ctx.fillStyle = '#ecf0f1';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawMaze();
        drawGoal();
        drawPlayer();
    }

    function movePlayer(dx, dy) {
        const newX = player.x + dx;
        const newY = player.y + dy;

        const playerGridCol = Math.floor(newX / TILE_SIZE);
        const playerGridRow = Math.floor(newY / TILE_SIZE);

        // Check for wall collisions
        // This collision needs to be more precise considering player size
        const nextTileCol = Math.floor((newX - playerSize/2 + dx * playerSize/2 ) / TILE_SIZE);
        const nextTileRow = Math.floor((newY - playerSize/2 + dy * playerSize/2 ) / TILE_SIZE);
        const nextTileCol2 = Math.floor((newX + playerSize/2 + dx * playerSize/2 -1) / TILE_SIZE);
        const nextTileRow2 = Math.floor((newY + playerSize/2 + dy * playerSize/2 -1) / TILE_SIZE);

        if (maze[nextTileRow] && maze[nextTileRow][nextTileCol] === 0 && 
            maze[nextTileRow2] && maze[nextTileRow2][nextTileCol2] === 0 &&
            maze[nextTileRow] && maze[nextTileRow][nextTileCol2] === 0 &&
            maze[nextTileRow2] && maze[nextTileRow2][nextTileCol] === 0) {
            player.x = newX;
            player.y = newY;
        }

        draw();
        checkWinCondition();
    }

    function checkWinCondition() {
        const dist = Math.sqrt(Math.pow(player.x - goal.x, 2) + Math.pow(player.y - goal.y, 2));
        if (dist < (playerSize / 2 + goalSize / 2) * 0.8) { // Check if player overlaps goal
            messageDisplay.textContent = 'Congratulations! You reached the goal!';
            // Optionally, disable movement or load next maze after a delay
            // For now, player can just start a new maze with the button.
        }
    }

    function handleKeyPress(e) {
        if (messageDisplay.textContent.startsWith('Congratulations')) return; // Stop movement if won

        const moveSpeed = TILE_SIZE / 2; // Move half a tile at a time
        switch (e.key) {
            case 'ArrowUp':
                movePlayer(0, -moveSpeed);
                break;
            case 'ArrowDown':
                movePlayer(0, moveSpeed);
                break;
            case 'ArrowLeft':
                movePlayer(-moveSpeed, 0);
                break;
            case 'ArrowRight':
                movePlayer(moveSpeed, 0);
                break;
        }
    }

    resetButton.addEventListener('click', initGame);
    document.addEventListener('keydown', handleKeyPress);

    // Initial game setup
    initGame();
});