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
			var _this = this;

			var numBombs = Math.ceil(this.TILES_X * this.TILES_Y * this.bombRatio),
			    bombTiles = [],
			    potentialBombTiles = [],
			    offLimitTiles = [];

			console.log(x, y);
			//Let's store all the offLimitTiles index's for easy reference
			offLimitTiles = this.getNeighbourTiles(x, y).map(function (tile) {
				return tile.tileIndex;
			});

			//Don't forget to add the center tile
			offLimitTiles.push(this.getTileIndex(x, y));

			//Create an array with all possible tiles on which we can place a bomb (i.e. no direct neighbours)
			for (var i = 0, len = this.TILES.length; i < len; i++) {
				if (offLimitTiles.indexOf(i) > -1) continue;
				potentialBombTiles.push(i);
			}

			potentialBombTiles = Minesweeper.shuffle(potentialBombTiles);

			//Pick the first 'numBombs' tile index's from the shuffled potentialBombTiles array
			bombTiles = potentialBombTiles.splice(0, numBombs);

			bombTiles.map(function (i) {
				_this.updateTileState(i, { isBomb: true });
				_this.TILES[i].elem.style.background = "red";
			});

			this.GAME_STARTED = true;
		}
	}, {
		key: "bindTileClick",
		value: function bindTileClick() {
			var _this2 = this;

			var allTiles = this.GAME_CONTAINER.getElementsByClassName("minesweeper__tile");

			var _loop = function _loop(i) {
				var tile = _this2.TILES[i];
				tile.elem = allTiles[i];
				tile.elem.addEventListener("click", function (e) {

					switch (true) {
						case !_this2.GAME_STARTED:
							_this2.generateGame(tile.x, tile.y);
							break;
						case tile.isCleared:
							return;
						case tile.isBomb:
							console.log("GAME OVER");
							return;
					}

					var tilesToRender = _this2.sweep(i);
					_this2.renderTiles(tilesToRender);
				});

				//Right click
				tile.elem.addEventListener('contextmenu', function (e) {
					e.preventDefault();
					tile.isFlagged = !tile.isFlagged;
					_this2.renderTiles([i]);
				}, false);
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
		key: "updateTileState",
		value: function updateTileState(tileIndex, state) {
			for (var prop in state) {
				this.TILES[tileIndex][prop] = state[prop];
			}
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
		key: "renderTiles",
		value: function renderTiles(tiles) {
			var _this3 = this;

			tiles.map(function (index) {
				var tile = _this3.TILES[index],
				    tileBg = "";

				if (tile.isCleared) {
					tileBg = "#e2e2e2";
				} else if (tile.isFlagged) {
					tileBg = "pink";
				} else {
					tileBg = "#fff";
				}

				tile.elem.style.backgroundColor = tileBg;

				if (tile.neighbouringBombs) {
					tile.elem.innerHTML = tile.neighbouringBombs;
				}
			});
		}
	}, {
		key: "sweep",
		value: function sweep(index) {
			var x = index % this.TILES_X,
			    y = Math.floor(index / this.TILES_Y),
			    queue = [{ x: x, y: y }],
			    sweptTiles = [],
			    alreadyChecked = [];

			for (var i = 0; i < queue.length; i++) {
				checkNeighboursForBombs.call(this, queue[i].x, queue[i].y);
			}

			return sweptTiles;

			function checkNeighboursForBombs(x, y) {
				var tileKey = String(x) + String(y); //Lets store the x and y index as a string literal

				if (alreadyChecked.indexOf(tileKey) > -1) return;

				alreadyChecked.push(tileKey);

				var numBombs = 0,
				    neighbours = this.getNeighbourTiles(x, y);

				for (var i = 0; i < neighbours.length; i++) {
					var tileIndex = neighbours[i].tileIndex;

					if (this.TILES[tileIndex].isBomb) {
						numBombs++;
					}
				}

				var tileIndex = this.getTileIndex(x, y);

				this.updateTileState(tileIndex, {
					neighbouringBombs: numBombs,
					isCleared: true
				});

				//Add the current tiles to the list of cleared tiles.
				sweptTiles.push(tileIndex);

				if (numBombs === 0) {
					queue = queue.concat(neighbours);
				}
			}
		}
	}], [{
		key: "shuffle",
		value: function shuffle(array) {
			var max = array.length,
			    temp,
			    rand;

			while (max > 0) {

				// Pick a remaining element…
				rand = Math.floor(Math.random() * max--);

				// And swap it with the last element.
				temp = array[max];
				array[max] = array[rand];
				array[rand] = temp;
			}

			return array;
		}
	}]);

	return Minesweeper;
}();

(function () {
	var minesweeper = new Minesweeper("game");
})();