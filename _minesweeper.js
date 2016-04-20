(function() {
	var minesweeper = new Minesweeper("game");
})();

class Minesweeper {
	constructor(container) {
		this.GAME_CONTAINER = document.getElementById(container);
		this.GAME_BOARD;
		this.TILES;
		this.TILES_X = 15;
		this.TILES_Y = 15;
		this.init();
	}
	
	init() {
		this.GAME_CONTAINER.className += "minesweeper__board cols-" + this.TILES_X + " rows-" + this.TILES_Y;
		this.generateBoard();
		this.drawBoard();
		this.bindTileClick();
	}
	
	generateBoard() {
		this.GAME_BOARD = [];
		for(var y of this.TILES_Y) {
			var row = [];
			for(var x of this.TILES_X) {
				row.push(Math.ceil(Math.random() * 5));
			}
			this.GAME_BOARD.push(row);
		}
	}
	
	drawBoard() {
		var html = "";
		for(var row of this.GAME_BOARD) {
			for(var col of row) {
				var classes = (col === 5) ? " is-bomb" : "";
				html += "<div class='minesweeper__tile" + classes + "'></div>";
			});
		});
		this.GAME_CONTAINER.innerHTML = html;
	}
	
	bindTileClick() {
		this.TILES = this.GAME_CONTAINER.getElementsByClassName("minesweeper__tile");	
		for(let i of this.TILES) {
			this.TILES[i].addEventListener("click", () => {
				sweep(i);
			});
		}
	}
	
	sweep(index) {
		var x = index % this.TILES_X,
			y = Math.floor(index / this.TILES_Y);
		
		console.log(this.GAME_BOARD[y][x]);
	}
	
}

function Minesweeper(container) {
	
	/** Private Variables **/
	var GAME_CONTAINER = document.getElementById(container),
		GAME_BOARD,
		TILES,
		TILES_X = 15,
		TILES_Y = 15;
	
	init();
	
	function init() {
		GAME_CONTAINER.className += "minesweeper__board cols-" + TILES_X + " rows-" + TILES_Y;
		generateBoard();
		drawBoard();
		bindTileClick();
	}
	
	function generateBoard() {
		GAME_BOARD = [];
		for(var i = 0; i < TILES_Y; i++) {
			var row = [];
			for(var j = 0; j < TILES_X; j++) {
				row.push(Math.ceil(Math.random() * 5));
			}
			GAME_BOARD.push(row);
		}
		return GAME_BOARD;
	}
	
	function drawBoard() {
		var html = "";
		GAME_BOARD.map(function(row) {
			row.map(function(col) {
				var classes = (col === 5) ? " is-bomb" : "";
				html += "<div class='minesweeper__tile" + classes + "'></div>";
			});
		});
		GAME_CONTAINER.innerHTML = html;
	}
	
	function bindTileClick() {
		TILES = GAME_CONTAINER.getElementsByClassName("minesweeper__tile");	
		for(var i = 0; i < TILES.length; i++) {
			(function(index) {
				TILES[index].addEventListener("click", function(e) {
					sweep(index);
				});
			})(i);
		}
	}
	
	function sweep(index) {
		var x = index % TILES_X,
			y = Math.floor(index / TILES_Y);
		console.log(GAME_BOARD[y][x]);
	}
}