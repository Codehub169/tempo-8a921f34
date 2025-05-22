document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas3');
    const messageDisplay = document.getElementById('messageDisplay3');
    const resetButton = document.getElementById('resetButton3');

    if (!canvas || !messageDisplay || !resetButton) {
        console.error('One or more essential HTML elements are missing. Game cannot start.');
        if (messageDisplay) messageDisplay.textContent = 'Error: Game files incomplete.';
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Failed to get canvas rendering context. Game cannot start.');
        if (messageDisplay) messageDisplay.textContent = 'Error: Canvas not supported or disabled.';
        return;
    }

    const TILE_SIZE = 40;
    const ROWS = canvas.height / TILE_SIZE;
    const COLS = canvas.width / TILE_SIZE;

    let player, maze, goal;

    // Player properties
    const playerColor = '#3498db';
    const playerSize = TILE_SIZE / 2; // Player is a square of this size

    // Goal properties
    const goalColor = '#2ecc71';
    const goalSize = TILE_SIZE / 1.8;

    // Maze wall color
    const wallColor = '#333333';

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
        if (MAZE_LAYOUTS.length === 0) {
            console.error("No maze layouts defined!");
            messageDisplay.textContent = "Error: No mazes available.";
            resetButton.disabled = true;
            document.removeEventListener('keydown', handleKeyPress); // Prevent trying to play
            return;
        }

        maze = MAZE_LAYOUTS[currentMazeIndex];
        // Prepare currentMazeIndex for the *next* call to initGame
        currentMazeIndex = (currentMazeIndex + 1) % MAZE_LAYOUTS.length;

        // Place player's center at the center of the first open tile (1,1)
        player = { 
            x: 1 * TILE_SIZE + TILE_SIZE / 2, 
            y: 1 * TILE_SIZE + TILE_SIZE / 2 
        };
        
        // Goal position: center of tile (ROWS-2, COLS-2)
        // Ensure goal is within maze boundaries if maze isn't square or default size
        const goalCol = Math.max(1, COLS - 2);
        const goalRow = Math.max(1, ROWS - 2);
        goal = { 
            x: goalCol * TILE_SIZE + TILE_SIZE / 2, 
            y: goalRow * TILE_SIZE + TILE_SIZE / 2 
        }; 
        
        messageDisplay.textContent = '';
        draw();
    }

    function drawMaze() {
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                if (maze[row] && maze[row][col] === 1) { // Added check for maze[row] existence
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
        ctx.fillStyle = '#ecf0f1'; // Background color for the maze area
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawMaze();
        drawGoal();
        drawPlayer();
    }

    function movePlayer(dx, dy) {
        const targetCenterX = player.x + dx;
        const targetCenterY = player.y + dy;
        const halfPSize = playerSize / 2;

        // Calculate player's bounding box at the target position
        const pLeft = targetCenterX - halfPSize;
        const pRight = targetCenterX + halfPSize;
        const pTop = targetCenterY - halfPSize;
        const pBottom = targetCenterY + halfPSize;

        // Epsilon for floating point precision at tile edges
        const epsilon = 0.001; 

        // Get tile coordinates for each corner of the player's bounding box
        const c1_col = Math.floor(pLeft / TILE_SIZE);
        const c1_row = Math.floor(pTop / TILE_SIZE);
        const c2_col = Math.floor((pRight - epsilon) / TILE_SIZE);
        const c2_row = Math.floor(pTop / TILE_SIZE);
        const c3_col = Math.floor(pLeft / TILE_SIZE);
        const c3_row = Math.floor((pBottom - epsilon) / TILE_SIZE);
        const c4_col = Math.floor((pRight - epsilon) / TILE_SIZE);
        const c4_row = Math.floor((pBottom - epsilon) / TILE_SIZE);

        let canMove = true;
        // Check each corner against boundaries and walls
        // Array of corner coordinates [row, col]
        const corners = [
            [c1_row, c1_col],
            [c2_row, c2_col],
            [c3_row, c3_col],
            [c4_row, c4_col]
        ];

        for (const [row, col] of corners) {
            if (row < 0 || row >= ROWS || col < 0 || col >= COLS || 
                !maze[row] || maze[row][col] === 1) { // Added !maze[row] check
                canMove = false;
                break;
            }
        }
        
        if (canMove) {
            player.x = targetCenterX;
            player.y = targetCenterY;
        }

        draw();
        checkWinCondition();
    }

    function checkWinCondition() {
        // Check distance between player center and goal center
        const dist = Math.sqrt(Math.pow(player.x - goal.x, 2) + Math.pow(player.y - goal.y, 2));
        // Consider collision when centers are close enough for overlap
        const collisionThreshold = (playerSize / 2 + goalSize / 2) * 0.8; // 80% overlap needed
        if (dist < collisionThreshold) { 
            messageDisplay.textContent = 'Congratulations! You reached the goal!';
            // Future: could add sound or disable keys more formally
        }
    }

    function handleKeyPress(e) {
        // Do not process movement if game is won
        if (messageDisplay.textContent.startsWith('Congratulations')) return;

        const moveSpeed = TILE_SIZE / 2; // Move half a tile at a time
        let moved = false;
        switch (e.key.toLowerCase()) {
            case 'w': // Fall-through for arrow keys if preferred
            case 'arrowup':
                movePlayer(0, -moveSpeed);
                moved = true;
                break;
            case 's':
            case 'arrowdown':
                movePlayer(0, moveSpeed);
                moved = true;
                break;
            case 'a':
            case 'arrowleft':
                movePlayer(-moveSpeed, 0);
                moved = true;
                break;
            case 'd':
            case 'arrowright':
                movePlayer(moveSpeed, 0);
                moved = true;
                break;
        }

        if (moved) {
            e.preventDefault(); // Prevent default browser action (e.g., scrolling with arrow keys)
        }
    }

    resetButton.addEventListener('click', initGame);
    document.addEventListener('keydown', handleKeyPress);

    // Initial game setup
    initGame();
});