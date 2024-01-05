
// get all of the game board cells
const cells = document.querySelectorAll(".cell");

// get the game status text
const gameStatusText = document.querySelector("#gameStatusText");

// get the restart button
const restartButton = document.querySelector("#restartButton");

// 'win' condition array
// used for checking for a 'win' condition
const winConditions =
[
    // row 1
    [0, 1, 2],

    // row 2
    [3, 4, 5],

    // row 3
    [6, 7, 8],

    // column 1
    [0, 3, 6],

    // column 2
    [1, 4, 7],

    // column 3
    [2, 5, 8],

    // diagnoal 1
    [2, 4, 6],

    // diagonal 2
    [0, 4, 8]
];


// player position array
// stores position of current player
// used for checking for a 'win' condition
let playerPosition = [];


// empty cell
const EMPTY_CELL = "";

// the current player
let currentPlayer;

// 'game is running' flag
let gameRunning;

// 'game over' flag
let theGameIsOver;


// game starts here
initialiseGame();


function initialiseGame()
{
    // add 'click' event listeners to the game board cells
    cells.forEach
    (
        cell => cell.addEventListener("click", cellClicked)
    );

    // add a 'click' event listener to the restart button
    restartButton.addEventListener("click", restartGame);

    // clear the game board
    resetGame();
}


function resetGame()
{
    // player position array
    // stores position of current player
    // used for checking for a 'win' condition
    playerPosition = 
    [
        "", "", "", 
        
        "", "", "", 
        
        "", "", ""
    ];

    // loop through the array to clear the cells
    cells.forEach
    (
        cell => cell.textContent = EMPTY_CELL
    );

    // reset current player
    currentPlayer = "X";

    // set 'game over' flag
    theGameIsOver = false;

    // set 'game running' status
    gameRunning = true;

    // set the game status text
    setGameStatusText(`${currentPlayer}'s turn`);
}


function cellClicked()
{
    // get the index number of clicked cell
    const cellIndex = this.getAttribute("cellIndex");

    // if the selected game cell is not empty or the game is not running
    if (playerPosition[cellIndex] != EMPTY_CELL || !gameRunning)
    {
        // simply return
        return;
    }

    // otherwise, update the selected cell with the current player
    updateCell(this, cellIndex);

    // then check to see if there is a winner
    checkForWinner();
}


function updateCell(selectedCell, selectedCellIndex)
{
    // store the current player at the selected position
    playerPosition[selectedCellIndex] = currentPlayer;

    selectedCell.textContent = currentPlayer;
}


function changePlayer()
{
    // if currentPlayer = "X"
    // then
    // set currentPlayer = "O"
    // otherwise
    // leave currentPlayer = "X"
    currentPlayer = (currentPlayer == "X") ? "O" : "X";

    // update game status text
    setGameStatusText(`${currentPlayer}'s turn`);
}


function checkForWinner()
{
    // loop through the 'winConditions' array
    // positions 0 - 8
    for (let i = 0; i < winConditions.length; i++)
    {
        // get the line of cells at the current position
        const winStatus = winConditions[i];

        // get the status of the three cells
        const cellA = playerPosition[winStatus[0]];

        const cellB = playerPosition[winStatus[1]];

        const cellC = playerPosition[winStatus[2]];
    
        // if none the cells being checked are occupied by a player
        if (cellA == EMPTY_CELL || cellB == EMPTY_CELL || cellC == EMPTY_CELL)
        {
            // move on to the next cell position
            continue;
        }

        // otherwise, if all three cells are occupied by the current player
        if (cellA == cellB && cellB == cellC)
        {
            // then set the 'game over' flag
            theGameIsOver = true;

            // and break out the loop
            break;
        }
    }

    // if the game is over
    if (theGameIsOver)
    {
        gameOver();
    }

    // otherwise, if there are no positions left on the board
    else if (!playerPosition.includes(EMPTY_CELL))
    {
        noMovesLeft();
    }

    // otherwise, change player
    else
    {
        changePlayer();
    }
}


function setGameStatusText(statusText)
{
    gameStatusText.textContent = statusText;
}


function gameOver()
{
    // update game status text
    setGameStatusText(`${currentPlayer} wins`);

    gameRunning = false;
}


function noMovesLeft()
{
    // update game status text
    setGameStatusText(`The game is a draw`);

    gameRunning = false;
}


function restartGame()
{
    // clear the game board
    resetGame();
}
