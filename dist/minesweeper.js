"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Minesweeper = function () {
	function Minesweeper(container) {
		_classCallCheck(this, Minesweeper);

		this.GAME_CONTAINER = document.getElementById(container);
		this.GAME_BOARD; //[y][x]
		this.TILES = [];
		this.TILES_X = 15;
		this.TILES_Y = 15;
		this.bombRatio = 0.15625;
		this.GAME_STARTED = false;
		this.neighbourOffsets = [{ x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }];
		this.init();
	}

	_createClass(Minesweeper, [{
		key: "init",
		value: function init() {
			this.GAME_CONTAINER.className += "minesweeper__board cols-" + this.TILES_X + " rows-" + this.TILES_Y;
			this.generateTiles();
			this.drawTiles();
			this.bindTileClick();
		}
	}, {
		key: "generateTiles",
		value: function generateTiles() {

			var len = this.TILES_X * this.TILES_Y;

			for (var i = 0; i < len; i++) {
				var tile = this.getTileCoords(i);
				this.elem = null;
				tile.isCleared = false;
				tile.isBomb = false;
				tile.flagged = false;
				this.neighbouringBombs = 0;
				this.TILES.push(tile);
			}
		}
	}, {
		key: "drawTiles",
		value: function drawTiles() {
			var html = "";
			for (var i = 0; i < this.TILES.length; i++) {
				html += "<div class='minesweeper__tile'></div>";
			}
			this.GAME_CONTAINER.innerHTML = html;
		}
	}, {
		key: "generateGame",
		value: function generateGame(x, y) {
			var totalBombs = Math.ceil(this.TILES_X * this.TILES_Y * this.bombRatio),
			    bombTiles = [],
			    neighbours = this.getNeighbourTiles(x, y);

			var x = 250;

			while (bombTiles.length < totalBombs) {
				console.log(bombTiles.length);
				var randomTileIndex = Math.ceil(Math.random() * totalBombs) - 1,
				    toContinue = false;

				//Try again if we've already created a bomb on this tile
				if (bombTiles.indexOf(randomTileIndex) > -1) continue;

				//Check that we're not trying to place a bomb on a neighbouring tile
				for (var i = 0; i < neighbours.length; i++) {
					if (neighbours[i].tileIndex === randomTileIndex) {
						toContinue = true;
						break;
					}
				}

				if (toContinue) continue;

				bombTiles.push(randomTileIndex);
			}

			this.GAME_STARTED = true;
		}
	}, {
		key: "bindTileClick",
		value: function bindTileClick() {
			var _this = this;

			var allTiles = this.GAME_CONTAINER.getElementsByClassName("minesweeper__tile");

			var _loop = function _loop(i) {
				_this.TILES[i].elem = allTiles[i];
				_this.TILES[i].elem.addEventListener("click", function () {

					if (!_this.GAME_STARTED) {
						_this.generateGame(_this.TILES[i].x, _this.TILES[i].y);
					}
					return;
					_this.sweep(i);
				});
			};

			for (var i = 0; i < this.TILES.length; i++) {
				_loop(i);
			}
		}
	}, {
		key: "getTileCoords",
		value: function getTileCoords(index) {
			var x = index % this.TILES_X,
			    y = Math.floor(index / this.TILES_Y);

			return { x: x, y: y };
		}
	}, {
		key: "getTileIndex",
		value: function getTileIndex(x, y) {
			return y * this.TILES_Y + x;
		}
	}, {
		key: "getNeighbourTiles",
		value: function getNeighbourTiles(x, y) {
			var neighbours = [];

			for (var i = 0; i < this.neighbourOffsets.length; i++) {
				var xOffset = x + this.neighbourOffsets[i].x,
				    yOffset = y + this.neighbourOffsets[i].y;

				//If we're out of bounds, continue onto the next iteration
				if (xOffset < 0 || xOffset > this.TILES_X - 1 || yOffset < 0 || yOffset > this.TILES_Y - 1) {
					continue;
				}

				neighbours.push({ x: xOffset, y: yOffset, tileIndex: this.getTileIndex(xOffset, yOffset) });
			}

			return neighbours;
		}
	}, {
		key: "updateTiles",
		value: function updateTiles() {}
	}, {
		key: "sweep",
		value: function sweep(index) {
			var _this2 = this;

			var x = index % this.TILES_X,
			    y = Math.floor(index / this.TILES_Y),
			    neighbourOffsets = [{ y: -1, x: -1 }, { y: -1, x: 0 }, { y: -1, x: 1 }, { y: 0, x: -1 }, { y: 0, x: 1 }, { y: 1, x: -1 }, { y: 1, x: 0 }, { y: 1, x: 1 }],
			    queue = [{ x: x, y: y }],
			    clearedTiles = [],
			    alreadyChecked = [];

			for (var i = 0; i < queue.length; i++) {
				checkNeighboursForBombs.call(this, queue[i].x, queue[i].y);
			}

			clearedTiles.map(function (tile) {
				var tileIndex = tile.y * _this2.TILES_Y + tile.x;
				_this2.TILES[tileIndex].style.backgroundColor = "blue";
				if (tile.bombs) {
					_this2.TILES[tileIndex].innerHTML = tile.bombs;
				}
			});

			function checkNeighboursForBombs(x, y) {
				var tileKey = String(x) + String(y); //Lets store the x and y index as a string literal

				if (alreadyChecked.indexOf(tileKey) > -1) return;

				alreadyChecked.push(tileKey);

				var numBombs = 0,
				    neighbours = []; //Let's keep track of neighbours in case we need to add them to queue later

				for (var i = 0; i < neighbourOffsets.length; i++) {
					var xOffset = x + neighbourOffsets[i].x;
					var yOffset = y + neighbourOffsets[i].y;

					//If we're out of bounds, continue onto the next iteration
					if (xOffset < 0 || xOffset > this.TILES_X - 1 || yOffset < 0 || yOffset > this.TILES_Y - 1) {
						continue;
					}

					if (this.GAME_BOARD[yOffset][xOffset] === 5) {
						numBombs++;
					}

					//Stop worrying about neighbours if we've discovered bombs
					if (numBombs === 0) {
						neighbours.push({ x: xOffset, y: yOffset });
					}
				}

				//Add the current tiles to the list of cleared tiles.
				clearedTiles.push({ x: x, y: y, bombs: numBombs });

				if (numBombs === 0) {
					queue = queue.concat(neighbours);
					clearedTiles = clearedTiles.concat(neighbours);
				}
			}
		}
	}]);

	return Minesweeper;
}();

(function () {
	var minesweeper = new Minesweeper("game");
})();