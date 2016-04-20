"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Minesweeper = function () {
	function Minesweeper(container) {
		_classCallCheck(this, Minesweeper);

		this.GAME_CONTAINER = document.getElementById(container);
		this.GAME_BOARD; //[y][x]
		this.TILES;
		this.TILES_X = 15;
		this.TILES_Y = 15;
		this.init();
	}

	_createClass(Minesweeper, [{
		key: "init",
		value: function init() {
			this.GAME_CONTAINER.className += "minesweeper__board cols-" + this.TILES_X + " rows-" + this.TILES_Y;
			this.generateBoard();
			this.drawBoard();
			this.bindTileClick();
		}
	}, {
		key: "generateBoard",
		value: function generateBoard() {
			this.GAME_BOARD = [];
			for (var y = 0; y < this.TILES_Y; y++) {
				var row = [];
				for (var x = 0; x < this.TILES_X; x++) {
					row.push(Math.ceil(Math.random() * 5));
				}
				this.GAME_BOARD.push(row);
			}
		}
	}, {
		key: "drawBoard",
		value: function drawBoard() {
			var html = "";
			for (var row = 0; row < this.TILES_Y; row++) {
				for (var col = 0; col < this.TILES_X; col++) {
					var classes = this.GAME_BOARD[row][col] === 5 ? " is-bomb" : "";
					html += "<div class='minesweeper__tile" + classes + "'></div>";
				}
			}
			this.GAME_CONTAINER.innerHTML = html;
		}
	}, {
		key: "bindTileClick",
		value: function bindTileClick() {
			var _this = this;

			this.TILES = this.GAME_CONTAINER.getElementsByClassName("minesweeper__tile");

			var _loop = function _loop(i) {
				_this.TILES[i].addEventListener("click", function () {
					_this.sweep(i);
				});
			};

			for (var i = 0; i < this.TILES.length; i++) {
				_loop(i);
			}
		}
	}, {
		key: "sweep",
		value: function sweep(index) {
			var x = index % this.TILES_X,
			    y = Math.floor(index / this.TILES_Y),
			    neighbourOffsets = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]],
			    //[y, x]
			queue = [],
			    alreadyChecked = [];

			checkNeighboursForBombs.call(this, x, y);

			function checkNeighboursForBombs(x, y) {
				var tileKey = String(x) + String(y); //Lets store the x and y index as a string literal

				if (alreadyChecked.indexOf(tileKey) > -1) return;

				alreadyChecked.push(tileKey);

				var numBombs = 0,
				    neighbours = [];

				for (var i = 0; i < neighbourOffsets.length; i++) {
					var xOffset = x + neighbourOffsets[i][1];
					var yOffset = y + neighbourOffsets[i][0];

					//If we're out of bounds, continue onto the next iteration
					if (xOffset < 0 || xOffset > this.TILES_X - 1 || yOffset < 0 || yOffset > this.TILES_Y - 1) {
						continue;
					}

					if (this.GAME_BOARD[yOffset][xOffset] === 5) {
						numBombs++;
					}

					if (numBombs === 0) {
						neighbours.push([yOffset, xOffset]);
					}
				}

				if (numBombs === 0) {
					queue = queue.concat(neighbours);
				}
			}
		}
	}]);

	return Minesweeper;
}();

(function () {
	var minesweeper = new Minesweeper("game");
})();