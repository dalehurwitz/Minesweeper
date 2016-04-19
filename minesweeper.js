(function() {
	var minesweeper = new Minesweeper("game");
})();

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