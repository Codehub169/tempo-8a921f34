document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('memoryGameBoard');
    const movesCountDisplay = document.getElementById('movesCount5');
    const timerDisplay = document.getElementById('timer5');
    const restartButton = document.getElementById('restartButton5');
    const gameMessageDisplay = document.getElementById('gameMessageDisplay5');

    if (!gameBoard || !movesCountDisplay || !timerDisplay || !restartButton || !gameMessageDisplay) {
        console.error("One or more essential HTML elements for Game 5 are missing.");
        if (gameMessageDisplay) { // Attempt to show error to user if message display exists
            gameMessageDisplay.textContent = "Error: Game components failed to load. Please refresh.";
            gameMessageDisplay.style.color = "red";
        }
        return; // Stop script execution if critical elements are missing
    }

    // Card symbols using Font Awesome icons
    const symbols = [
        'fas fa-star', 'fas fa-heart', 'fas fa-anchor', 'fas fa-bolt',
        'fas fa-cube', 'fas fa-leaf', 'fas fa-bicycle', 'fas fa-bomb'
        // Add more pairs if you increase grid size (e.g., for a 5x4 board, add 2 more symbols)
    ];
    let cards = []; // Array to store card DOM elements, not strictly used after creation but good for reference
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let timerInterval;
    let seconds = 0;
    let gameActive = true;

    function initializeGame() {
        gameActive = true;
        moves = 0;
        matchedPairs = 0;
        seconds = 0;
        flippedCards = [];

        // Clear previous timer if any
        clearInterval(timerInterval);
        // Reset displays
        movesCountDisplay.textContent = moves;
        timerDisplay.textContent = seconds + 's';
        gameMessageDisplay.textContent = '';
        gameMessageDisplay.style.color = ''; // Reset color

        if (symbols.length === 0) {
            gameMessageDisplay.textContent = "Error: No card symbols defined. Game cannot start.";
            gameMessageDisplay.style.color = '#e74c3c'; // Red for error
            gameActive = false;
            if (restartButton) restartButton.disabled = true;
            return; // Stop initialization
        }
        // Ensure button is enabled if game can start
        if (restartButton) restartButton.disabled = false;

        startTimer(); // Start timer only if game setup can proceed

        const gameSymbols = [...symbols, ...symbols]; // Create pairs
        shuffleArray(gameSymbols);

        gameBoard.innerHTML = ''; // Clear previous cards
        cards = []; // Reset cards array

        gameSymbols.forEach(symbol => {
            const cardElement = createCard(symbol);
            gameBoard.appendChild(cardElement);
            cards.push(cardElement);
        });
    }

    function createCard(symbol) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol; // Store symbol data on the card

        // Card front (initially shows a blank face, or icon with opacity 0)
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-face', 'card-front');
        const frontIcon = document.createElement('i');
        frontIcon.className = symbol; // Add symbol to front face, CSS will hide it initially
        cardFront.appendChild(frontIcon);

        // Card back (contains the symbol, revealed on flip)
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-face', 'card-back');
        const backIcon = document.createElement('i');
        backIcon.className = symbol; // Assigns classes like 'fas fa-star'
        cardBack.appendChild(backIcon);

        card.appendChild(cardFront);
        card.appendChild(cardBack);

        card.addEventListener('click', () => handleCardClick(card));
        return card;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
    }

    function handleCardClick(clickedCard) {
        if (!gameActive || clickedCard.classList.contains('is-flipped') || clickedCard.classList.contains('is-matched') || flippedCards.length === 2) {
            return; // Ignore click if game not active, card already flipped/matched, or 2 cards already up
        }

        clickedCard.classList.add('is-flipped');
        flippedCards.push(clickedCard);

        if (flippedCards.length === 2) {
            incrementMoves();
            checkForMatch();
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.symbol === card2.dataset.symbol) {
            // Matched
            card1.classList.add('is-matched');
            card2.classList.add('is-matched');
            
            // Remove 'is-flipped' so card shows its front face (with icon visible due to .is-matched CSS).
            card1.classList.remove('is-flipped');
            card2.classList.remove('is-flipped');
            
            matchedPairs++;
            flippedCards = []; // Clear for next pair

            if (matchedPairs === symbols.length) {
                endGame(true); // All pairs matched - win
            }
        } else {
            // No match
            gameBoard.style.pointerEvents = 'none'; // Prevent further clicks during the timeout
            setTimeout(() => {
                card1.classList.remove('is-flipped');
                card2.classList.remove('is-flipped');
                flippedCards = [];
                gameBoard.style.pointerEvents = 'auto'; // Re-enable clicks
            }, 1000); // Flip back after 1 second
        }
    }

    function incrementMoves() {
        moves++;
        movesCountDisplay.textContent = moves;
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            if (gameActive) { // Only increment if game is active
                seconds++;
                timerDisplay.textContent = seconds + 's';
            }
        }, 1000);
    }

    function endGame(isWin) {
        clearInterval(timerInterval);
        gameActive = false;
        if (isWin) {
            gameMessageDisplay.textContent = `You won in ${moves} moves and ${seconds}s!`;
            gameMessageDisplay.style.color = '#2ecc71'; // Green for win
        } else {
            // This specific game version doesn't have an explicit lose condition other than restart
            gameMessageDisplay.textContent = 'Game Over! Restart to try again.';
            gameMessageDisplay.style.color = '#e74c3c'; // Red for general game over message
        }
    }

    restartButton.addEventListener('click', initializeGame);

    // Initial game setup
    initializeGame();
});
