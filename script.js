// array to store the board 
let origBoard;

// symbol select
let playerSymbol;

// human player
let humanPlayer;

// ai player
let aiPlayer;

// array to store the winning combinations of the game
const winCombos = 
[
	// horizontal lines
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],

	// vertical lines
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],

	// diagonal lines
	[0, 4, 8],
	[6, 4, 2]
]

// empty cell
const EMPTY_CELL = "";

// creates an array of positions on the board by
// selecting all of the html elements with the class named '.cell'
const cells = document.querySelectorAll('.cell');

// get a reference to the 'restart' button
const restartButton = document.querySelector("#restartButton");

// get a reference to the 'X' button
const xButton = document.querySelector("#xButton");

// get a reference to the 'O' button
const oButton = document.querySelector("#oButton");

const selectorPanel_UI = document.querySelector('.playerSymbolPanel'); //.style.display = "none";

const gameBoard_UI = document.querySelector('#gameBoard'); //.style.display = "block";





// start the game
initialiseGame();



function initialiseGame()
{
	// add a 'click' event listener to the restart button
	restartButton.addEventListener("click", resetGame);

	// add a 'click' event listener to the xbutton button
	xButton.addEventListener("click", playerX);

	// add a 'click' event listener to the obutton button
	oButton.addEventListener("click", playerO);


	// reset the game
	resetGame();
}


function playerX()
{
	playerSymbol = "X";

	startGame(playerSymbol);
}


function playerO()
{
	playerSymbol = "O";

	startGame(playerSymbol);
}


function startGame(playerSymbol)
{
	// hide the player symbol select panel
	selectorPanel_UI.style.display = "none";
	
	// show the game board
	gameBoard_UI.style.display = "block";

	// assign the selected symbol to the human player
	humanPlayer = playerSymbol;

	// assign the remaining symbol to the ai player
	// if player has selected 'O'
	// then,
	// ai = 'X'
	// otherwise,
	// ai = 'O'
	aiPlayer = playerSymbol === 'O' ? 'X' : 'O';

	// loop through all of the positions in the 'cells' array and add a 'click' event listener
	for (let i = 0; i < cells.length; i++) 
	{
		cells[i].addEventListener('click', turnClick, false);
	}

	// if the human player has selected 'O'
	// then ai makes the first move
	if (aiPlayer === 'X') 
	{
	  	turn(bestSpot(), aiPlayer);
	}
}


function resetGame() 
{
	// hide the game state text
	document.querySelector(".endgame").style.display = "none";

	// hide the restart button
	document.querySelector('.gameButtonPanel').style.display = "none";

	// hide the game board
	document.querySelector('#gameBoard').style.display = "none";

	// clear the game board
	for (let i = 0; i < cells.length; i++) 
  	{
		cells[i].innerText = EMPTY_CELL;

		cells[i].style.removeProperty('background-color');
	}

	// initialise the game board with the numbers 0 - 8
	// stores position of current player
	origBoard = 
	[
		0, 1, 2,

		3, 4, 5,

		6, 7, 8
	];
  	
	// show the select player symbol panel
	document.querySelector('.playerSymbolPanel').style.display = "block";
}


function turnClick(square) 
{
	if (typeof origBoard[square.target.id] == 'number') 
  	{
		turn(square.target.id, humanPlayer)

		if (!checkWin(origBoard, humanPlayer) && !checkTie())
		{
			turn(bestSpot(), aiPlayer);
		}
	}
}


function turn(squareId, player) 
{
	origBoard[squareId] = player;

	document.getElementById(squareId).innerText = player;

	let gameWon = checkWin(origBoard, player)

	if (gameWon)
	{
		gameOver(gameWon)
	}

	checkTie();
}


function checkWin(board, player) 
{
	let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);

	let gameWon = null;

	for (let [index, win] of winCombos.entries()) 
  	{
		if (win.every(elem => plays.indexOf(elem) > -1)) 
		{
			gameWon = {index: index, player: player};

			break;
		}
	}

	return gameWon;
}


function checkTie() 
{
	if (emptySquares().length == 0) 
  	{
		for (let i = 0; i < cells.length; i++) 
    	{
			cells[i].style.backgroundColor = "green";

			cells[i].removeEventListener('click', turnClick, false);
		}

		declareWinner("Tie Game!")

		return true;
	}

	return false;
}


function gameOver(gameWon) 
{
	for (let index of winCombos[gameWon.index]) 
  	{
		document.getElementById(index).style.backgroundColor = gameWon.player == humanPlayer ? "blue" : "red";
	}

	for (let i = 0; i < cells.length; i++) 
  	{
		cells[i].removeEventListener('click', turnClick, false);
	}

	declareWinner(gameWon.player == humanPlayer ? "You win!" : "You lose.");
}


function declareWinner(who) 
{
	document.querySelector(".endgame").style.display = "block";

	document.querySelector(".endgame .text").innerText = who;

	// show the restart button
	document.querySelector('.gameButtonPanel').style.display = "block";
}


function emptySquares() 
{
	return origBoard.filter(s => typeof s == 'number');
}


function bestSpot() 
{
	return minimax(origBoard, aiPlayer).index;
}


function minimax(newBoard, player) 
{
	let availSpots = emptySquares();

	if (checkWin(newBoard, humanPlayer)) 
  	{
		return {score: -10};
	} 
  
  	else if (checkWin(newBoard, aiPlayer)) 
  	{
		return {score: 10};
	} 
  
  	else if (availSpots.length === 0) 
  	{
		return {score: 0};
	}

	let moves = [];

	for (let i = 0; i < availSpots.length; i++) 
  	{
		let move = {};

		move.index = newBoard[availSpots[i]];

		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) 
    	{
			let result = minimax(newBoard, humanPlayer);

			move.score = result.score;
		} 
		
		else 
		{
			let result = minimax(newBoard, aiPlayer);

			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	// if it is the computer's turn
	let bestMove;

	if(player === aiPlayer) 
  	{
		let bestScore = -10000;

		// loop through the available moves and choose the move with the highest score
		for(let i = 0; i < moves.length; i++) 
    	{
			if (moves[i].score > bestScore) 
      		{
				bestScore = moves[i].score;

				bestMove = i;
			}
		}
	} 
  
	// otherwise,
  	else 
  	{
		let bestScore = 10000;

		for(let i = 0; i < moves.length; i++) 
		{
			if (moves[i].score < bestScore) 
			{
				bestScore = moves[i].score;

				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}
