"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Minesweeper = function () {
	function Minesweeper(container) {
		_classCallCheck(this, Minesweeper);

		this.GAME_CONTAINER = null;
		this.GAME_STATE = {};
		this.difficultySettings = {
			"0": {
				TILES_X: 9,
				TILES_Y: 9,
				BOMB_RATIO: 0.15625
			},
			"1": {
				TILES_X: 15,
				TILES_Y: 15,
				BOMB_RATIO: 0.15625
			},
			"2": {
				TILES_X: 30,
				TILES_Y: 15,
				BOMB_RATIO: 0.20625
			}
		};
		this.defaults = this.difficultySettings["0"];
		this.neighbourOffsets = [{ x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }];
		this.setupGameContainer(container);
		this.startGame(this.defaults);
	}

	_createClass(Minesweeper, [{
		key: "startGame",
		value: function startGame(settings) {
			this.setInitialGamestate(settings);
			this.GAME_CONTAINER.className = "minesweeper__board cols-" + settings.TILES_X + " rows-" + settings.TILES_Y;
			this.generateTiles();
			this.drawTiles();
			this.bindTileClick();
		}
	}, {
		key: "setInitialGamestate",
		value: function setInitialGamestate(settings) {
			this.GAME_STATE.TILES_X = settings.TILES_X;
			this.GAME_STATE.TILES_Y = settings.TILES_Y;
			this.GAME_STATE.TILES = [];
			this.GAME_STATE.CLEARED_TILES = [];
			this.GAME_STATE.BOMB_RATIO = settings.BOMB_RATIO;
			this.GAME_STATE.BOMBS = [];
			this.GAME_STATE.GAME_STARTED = false;
			this.GAME_STATE.GAME_COMPLETED = false;
			this.GAME_STATE.GAME_OVER = false;
		}
	}, {
		key: "setupGameContainer",
		value: function setupGameContainer(container) {
			var outer = document.getElementById(container);
			var inner = document.createElement("div");
			var controls = document.createElement("div");

			controls.className = "minesweeper__controls";
			controls.innerHTML = '<ul>\
									<li><button class="minesweeper__dificulty-selector" data-difficulty="0">Beginner</button></li>\
									<li><button class="minesweeper__dificulty-selector" data-difficulty="1">Intermediate</button></li>\
									<li><button class="minesweeper__dificulty-selector" data-difficulty="2">Expert</button></li>\
								</ul>';

			outer.appendChild(inner);
			outer.appendChild(controls);
			this.bindControls();
			this.GAME_CONTAINER = inner;
		}
	}, {
		key: "bindControls",
		value: function bindControls() {
			var controls = document.getElementsByClassName("minesweeper__dificulty-selector");

			for (var i = 0; i < controls.length; i++) {
				controls[i].addEventListener("click", handleClick.bind(this, controls[i]));
			}

			function handleClick(control) {
				var difficulty = control.dataset.difficulty;
				this.startGame(this.difficultySettings[difficulty]);
			}
		}
	}, {
		key: "generateTiles",
		value: function generateTiles() {

			var len = this.GAME_STATE.TILES_X * this.GAME_STATE.TILES_Y;

			for (var i = 0; i < len; i++) {
				var tile = this.getTileCoords(i);
				this.elem = null;
				tile.isCleared = false;
				tile.isBomb = false;
				tile.flagged = false;
				this.neighbouringBombs = 0;
				this.GAME_STATE.TILES.push(tile);
			}
		}
	}, {
		key: "drawTiles",
		value: function drawTiles() {
			var html = "";
			for (var i = 0; i < this.GAME_STATE.TILES.length; i++) {
				html += "<div class='minesweeper__tile'></div>";
			}
			this.GAME_CONTAINER.innerHTML = html;
		}
	}, {
		key: "generateGame",
		value: function generateGame(x, y) {
			var _this = this;

			var totalBombs = Math.ceil(this.GAME_STATE.TILES_X * this.GAME_STATE.TILES_Y * this.GAME_STATE.BOMB_RATIO);

			var bombTiles = [],
			    potentialBombTiles = [],
			    offLimitTiles = [];

			//Let's store all the offLimitTiles index's for easy reference
			offLimitTiles = this.getNeighbourTiles(x, y).map(function (tile) {
				return tile.tileIndex;
			});

			//Don't forget to add the center tile
			offLimitTiles.push(this.getTileIndex(x, y));

			//Create an array with all possible tiles on which we can place a bomb (i.e. no direct neighbours)
			for (var i = 0, len = this.GAME_STATE.TILES.length; i < len; i++) {
				if (offLimitTiles.indexOf(i) > -1) continue;
				potentialBombTiles.push(i);
			}

			potentialBombTiles = Minesweeper.shuffle(potentialBombTiles);

			//Pick the first 'numBombs' tile index's from the shuffled potentialBombTiles array
			this.GAME_STATE.BOMBS = potentialBombTiles.splice(0, totalBombs);

			this.GAME_STATE.BOMBS.map(function (i) {
				_this.updateTileState(i, { isBomb: true });
				_this.GAME_STATE.TILES[i].elem.style.background = "red";
			});

			this.GAME_STATE.GAME_STARTED = true;
		}
	}, {
		key: "bindTileClick",
		value: function bindTileClick() {
			var _this2 = this;

			var allTiles = this.GAME_CONTAINER.getElementsByClassName("minesweeper__tile");

			var _loop = function _loop(i) {
				var tile = _this2.GAME_STATE.TILES[i];
				tile.elem = allTiles[i];
				tile.elem.addEventListener("click", handleClick.bind(_this2, tile, i));
				//			tile.elem.addEventListener("click", () => {
				//				console.log(i, this.getTileCoords(i));
				//			});

				//Right click
				tile.elem.addEventListener('contextmenu', function (e) {
					e.preventDefault();
					handleRightClick.call(_this2, tile, i);
				}, false);
			};

			for (var i = 0; i < this.GAME_STATE.TILES.length; i++) {
				_loop(i);
			}

			function handleClick(tile, index) {

				console.log(index, this.getTileCoords(index));

				//Tile is inactive
				if (tile.isCleared || tile.isFlagged) {
					return;
				}

				//Game hasn't been started yet
				if (!this.GAME_STATE.GAME_STARTED) {
					this.generateGame(tile.x, tile.y);
				}

				//Tile is a bomb -> Game Over
				else if (tile.isBomb) {
						this.gameOver();
						return;
					}

				//Default action
				var tilesToRender = this.sweep(index);

				this.renderTiles(tilesToRender);
			}

			function handleRightClick(tile, index) {
				tile.isFlagged = !tile.isFlagged;
				this.renderTiles([index]);
			}
		}
	}, {
		key: "gameOver",
		value: function gameOver() {
			this.GAME_CONTAINER.className += " game-over";
		}
	}, {
		key: "getTileCoords",
		value: function getTileCoords(index) {
			var x = index % this.GAME_STATE.TILES_X,
			    y = Math.floor(index / this.GAME_STATE.TILES_X);

			return { x: x, y: y };
		}
	}, {
		key: "getTileIndex",
		value: function getTileIndex(x, y) {
			return y * this.GAME_STATE.TILES_Y + x;
		}
	}, {
		key: "updateTileState",
		value: function updateTileState(tileIndex, state) {
			for (var prop in state) {
				this.GAME_STATE.TILES[tileIndex][prop] = state[prop];
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
				if (xOffset < 0 || xOffset > this.GAME_STATE.TILES_X - 1 || yOffset < 0 || yOffset > this.GAME_STATE.TILES_Y - 1) {
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
				var tile = _this3.GAME_STATE.TILES[index],
				    tileClass = "";

				if (tile.isCleared) {
					tileClass = " is-cleared";
					if (tile.neighbouringBombs > 0) {
						var numBombs = tile.neighbouringBombs;
						tileClass += " bombs--" + (numBombs > 4 ? 4 : numBombs);
					}
				} else if (tile.isFlagged) {
					tileClass = " is-flagged";
				} else {
					tile.elem.className = tile.elem.className.replace(/\sis-flagged/g, "");
				}

				tile.elem.className += tileClass;

				if (tile.neighbouringBombs) {
					tile.elem.innerHTML = tile.neighbouringBombs;
				}
			});
		}
	}, {
		key: "sweep",
		value: function sweep(index) {
			var coords = this.getTileCoords(index),
			    x = coords.x,
			    y = coords.y,
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

					if (this.GAME_STATE.TILES[tileIndex].isBomb) {
						numBombs++;
					}
				}

				var tileIndex = this.getTileIndex(x, y);

				//Keep this tile's state hidden if it has been flagged
				if (!this.GAME_STATE.TILES[tileIndex].isFlagged) {
					this.updateTileState(tileIndex, {
						neighbouringBombs: numBombs,
						isCleared: true
					});

					//Because there's a risk of duplicates, make sure we aren't counting a cleared tile twice
					if (this.GAME_STATE.CLEARED_TILES.indexOf(tileIndex) === -1) {
						this.GAME_STATE.CLEARED_TILES.push(tileIndex);
					}
				}

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
