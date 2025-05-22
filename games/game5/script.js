document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('memoryGameBoard');
    const movesCountDisplay = document.getElementById('movesCount5');
    const timerDisplay = document.getElementById('timer5');
    const restartButton = document.getElementById('restartButton5');
    const gameMessageDisplay = document.getElementById('gameMessageDisplay5');

    // Card symbols using Font Awesome icons
    const symbols = [
        'fas fa-star', 'fas fa-heart', 'fas fa-anchor', 'fas fa-bolt',
        'fas fa-cube', 'fas fa-leaf', 'fas fa-bicycle', 'fas fa-bomb'
        // Add more pairs if you increase grid size
    ];
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let timerInterval;
    let seconds = 0;
    let gameActive = true;

    // Duplicate symbols to create pairs and shuffle
    function initializeGame() {
        gameActive = true;
        moves = 0;
        matchedPairs = 0;
        seconds = 0;
        flippedCards = [];
        movesCountDisplay.textContent = moves;
        timerDisplay.textContent = seconds + 's';
        gameMessageDisplay.textContent = '';
        clearInterval(timerInterval);
        startTimer();

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
        card.dataset.symbol = symbol;

        // Card front (initially visible, but appears blank until flipped)
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-face', 'card-front');
        // Add an invisible icon to the front to be revealed on match, or keep it simple with just color
        // For simplicity, we'll just use the background color and the main icon will be on the 'back' (becomes visible on flip)

        // Card back (contains the symbol, revealed on flip)
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-face', 'card-back');
        const icon = document.createElement('i');
        icon.className = symbol; // Assigns classes like 'fas fa-star'
        cardBack.appendChild(icon);

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
            return;
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
            // Keep them flipped, the 'is-matched' class handles visual distinction
            // and prevents re-clicking via handleCardClick logic
            matchedPairs++;
            flippedCards = [];

            if (matchedPairs === symbols.length) {
                endGame(true); // All pairs matched - win
            }
        } else {
            // No match
            // Prevent further clicks on any card during the timeout
            gameBoard.style.pointerEvents = 'none';
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
            if (gameActive) {
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
            // This game doesn't have a specific lose condition other than giving up
            gameMessageDisplay.textContent = 'Game Over! Restart to try again.';
            gameMessageDisplay.style.color = '#e74c3c'; // Red for general game over message
        }
    }

    restartButton.addEventListener('click', initializeGame);

    // Initial game setup
    initializeGame();
});
