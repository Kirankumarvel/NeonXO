document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const statusElement = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    const player1Element = document.getElementById('player1');
    const player2Element = document.getElementById('player2');
    const player1ScoreElement = player1Element.querySelector('.score');
    const player2ScoreElement = player2Element.querySelector('.score');
    
    let board = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let gameActive = true;
    let scores = { X: 0, O: 0 };
    
    // Initialize the game board
    function initializeBoard() {
        boardElement.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-index', i);
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
        }
        updatePlayerDisplay();
    }
    
    // Handle cell clicks
    function handleCellClick(e) {
        const index = e.target.getAttribute('data-index');
        
        if (board[index] !== "" || !gameActive) return;
        
        board[index] = currentPlayer;
        e.target.textContent = currentPlayer;
        e.target.classList.add(currentPlayer.toLowerCase());
        
        checkGameStatus();
    }
    
    // Check for winner or tie
    function checkGameStatus() {
        fetch('/check_winner', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ board: board })
        })
        .then(response => response.json())
        .then(data => {
            if (data.winner) {
                handleWin(data.winner, data.winningCells);
            } else if (data.isTie) {
                handleTie();
            } else {
                switchPlayer();
            }
        });
    }
    
    // Handle win
    function handleWin(winner, winningCells) {
        gameActive = false;
        scores[winner]++;
        updateScores();
        
        winningCells.forEach(index => {
            document.querySelector(`.cell[data-index="${index}"]`).classList.add('winner');
        });
        
        statusElement.textContent = `Player ${winner} wins!`;
    }
    
    // Handle tie
    function handleTie() {
        gameActive = false;
        statusElement.textContent = "Game ended in a tie!";
    }
    
    // Switch players
    function switchPlayer() {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusElement.textContent = `Player ${currentPlayer}'s turn`;
        updatePlayerDisplay();
    }
    
    // Update player display
    function updatePlayerDisplay() {
        if (currentPlayer === "X") {
            player1Element.classList.add('active');
            player2Element.classList.remove('active');
        } else {
            player1Element.classList.remove('active');
            player2Element.classList.add('active');
        }
    }
    
    // Update scores
    function updateScores() {
        player1ScoreElement.textContent = scores.X;
        player2ScoreElement.textContent = scores.O;
    }
    
    // Reset game
    function resetGame() {
        board = ["", "", "", "", "", "", "", "", ""];
        currentPlayer = "X";
        gameActive = true;
        statusElement.textContent = `Player ${currentPlayer}'s turn`;
        initializeBoard();
    }
    
    // Event listeners
    resetButton.addEventListener('click', resetGame);
    
    // Initialize the game
    initializeBoard();
});