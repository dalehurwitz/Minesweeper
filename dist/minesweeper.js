"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,t){for(var i=0;i<t.length;i++){var s=t[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,s.key,s)}}return function(t,i,s){return i&&e(t.prototype,i),s&&e(t,s),t}}(),Minesweeper=function(){function e(t){_classCallCheck(this,e),this.GAME_CONTAINER=null,this.GAME_STATE={},this.difficultySettings={0:{TILES_X:9,TILES_Y:9,BOMB_RATIO:.15625},1:{TILES_X:15,TILES_Y:15,BOMB_RATIO:.15625},2:{TILES_X:30,TILES_Y:15,BOMB_RATIO:.20625}},this.defaults=this.difficultySettings[1],this.neighbourOffsets=[{x:-1,y:-1},{x:0,y:-1},{x:1,y:-1},{x:-1,y:0},{x:1,y:0},{x:-1,y:1},{x:0,y:1},{x:1,y:1}],this.setupGameContainer(t),this.startGame(this.defaults)}return _createClass(e,[{key:"startGame",value:function(e){this.setInitialGamestate(e),this.GAME_CONTAINER.className="minesweeper__board cols-"+e.TILES_X+" rows-"+e.TILES_Y,this.generateTiles(),this.drawTiles(),this.bindTileClick()}},{key:"setInitialGamestate",value:function(e){this.GAME_STATE.TILES_X=e.TILES_X,this.GAME_STATE.TILES_Y=e.TILES_Y,this.GAME_STATE.TILES=[],this.GAME_STATE.CLEARED_TILES=[],this.GAME_STATE.BOMB_RATIO=e.BOMB_RATIO,this.GAME_STATE.BOMBS=[],this.GAME_STATE.GAME_STARTED=!1,this.GAME_STATE.GAME_COMPLETED=!1,this.GAME_STATE.GAME_OVER=!1}},{key:"setupGameContainer",value:function(e){var t=document.getElementById(e),i=document.createElement("div"),s=document.createElement("div");s.className="minesweeper__controls",s.innerHTML='<ul>                <li><button class="minesweeper__dificulty-selector" data-difficulty="0">Beginner</button></li>                <li><button class="minesweeper__dificulty-selector" data-difficulty="1">Intermediate</button></li>                <li><button class="minesweeper__dificulty-selector" data-difficulty="2">Expert</button></li>            </ul>',t.appendChild(i),t.appendChild(s),this.bindControls(),this.GAME_CONTAINER=i}},{key:"bindControls",value:function(){function e(e){var t=e.dataset.difficulty;this.startGame(this.difficultySettings[t])}for(var t=document.getElementsByClassName("minesweeper__dificulty-selector"),i=0;i<t.length;i++)t[i].addEventListener("click",e.bind(this,t[i]))}},{key:"generateTiles",value:function(){for(var e=this.GAME_STATE.TILES_X*this.GAME_STATE.TILES_Y,t=0;e>t;t++){var i=this.getTileCoords(t);this.elem=null,i.isCleared=!1,i.isBomb=!1,i.flagged=!1,this.neighbouringBombs=0,this.GAME_STATE.TILES.push(i)}}},{key:"drawTiles",value:function(){for(var e="",t=0;t<this.GAME_STATE.TILES.length;t++)e+="<div class='minesweeper__tile'></div>";this.GAME_CONTAINER.innerHTML=e}},{key:"generateGame",value:function(t,i){var s=this,n=Math.ceil(this.GAME_STATE.TILES_X*this.GAME_STATE.TILES_Y*this.GAME_STATE.BOMB_RATIO),l=[],a=[];a=this.getNeighbourTiles(t,i).map(function(e){return e.tileIndex}),a.push(this.getTileIndex(t,i));for(var T=0,E=this.GAME_STATE.TILES.length;E>T;T++)a.indexOf(T)>-1||l.push(T);l=e.shuffle(l),this.GAME_STATE.BOMBS=l.splice(0,n),this.GAME_STATE.BOMBS.map(function(e){s.updateTileState(e,{isBomb:!0})}),this.GAME_STATE.GAME_STARTED=!0}},{key:"bindTileClick",value:function(){function e(e,t){if(this.GAME_STATE.GAME_OVER)return void this.startGame(this.GAME_STATE);if(!e.isCleared&&!e.isFlagged){if(this.GAME_STATE.GAME_STARTED){if(e.isBomb)return void this.gameOver(e)}else this.generateGame(e.x,e.y);var i=this.sweep(t);this.renderTiles(i)}}function t(e,t){e.isFlagged=!e.isFlagged,this.renderTiles([t])}for(var i=this,s=this.GAME_CONTAINER.getElementsByClassName("minesweeper__tile"),n=function(n){var l=i.GAME_STATE.TILES[n];l.elem=s[n],l.elem.addEventListener("click",e.bind(i,l,n)),l.elem.addEventListener("contextmenu",function(e){e.preventDefault(),t.call(i,l,n)},!1)},l=0;l<this.GAME_STATE.TILES.length;l++)n(l)}},{key:"gameOver",value:function(e){this.GAME_STATE.GAME_OVER=!0,this.GAME_CONTAINER.className+=" game-over",e.elem.className+=" bomb--exploded",this.renderTiles(this.GAME_STATE.BOMBS,!0)}},{key:"getTileCoords",value:function(e){var t=e%this.GAME_STATE.TILES_X,i=Math.floor(e/this.GAME_STATE.TILES_X);return{x:t,y:i}}},{key:"getTileIndex",value:function(e,t){return t*this.GAME_STATE.TILES_X+e}},{key:"updateTileState",value:function(e,t){for(var i in t)this.GAME_STATE.TILES[e][i]=t[i]}},{key:"getNeighbourTiles",value:function(e,t){for(var i=[],s=0;s<this.neighbourOffsets.length;s++){var n=e+this.neighbourOffsets[s].x,l=t+this.neighbourOffsets[s].y;0>n||n>this.GAME_STATE.TILES_X-1||0>l||l>this.GAME_STATE.TILES_Y-1||i.push({x:n,y:l,tileIndex:this.getTileIndex(n,l)})}return i}},{key:"renderTiles",value:function(e,t){var i=this;e.map(function(e){var s=i.GAME_STATE.TILES[e],n="";if(t&&s.isBomb)n=" is-bomb";else if(s.isCleared){if(n=" is-cleared",s.neighbouringBombs>0){var l=s.neighbouringBombs;n+=" bombs--"+(l>4?4:l)}}else s.isFlagged?n=" is-flagged":s.elem.className=s.elem.className.replace(/\sis-flagged/g,"");s.elem.className+=n,s.neighbouringBombs&&!t&&(s.elem.innerHTML=s.neighbouringBombs)})}},{key:"sweep",value:function(e){function t(e,t){var i=String(e)+String(t);if(!(T.indexOf(i)>-1)){T.push(i);for(var s=0,n=this.getNeighbourTiles(e,t),E=0;E<n.length;E++){var r=n[E].tileIndex;this.GAME_STATE.TILES[r].isBomb&&s++}var r=this.getTileIndex(e,t);this.GAME_STATE.TILES[r].isFlagged||(this.updateTileState(r,{neighbouringBombs:s,isCleared:!0}),-1===this.GAME_STATE.CLEARED_TILES.indexOf(r)&&this.GAME_STATE.CLEARED_TILES.push(r)),a.push(r),0===s&&(l=l.concat(n))}}for(var i=this.getTileCoords(e),s=i.x,n=i.y,l=[{x:s,y:n}],a=[],T=[],E=0;E<l.length;E++)t.call(this,l[E].x,l[E].y);return a}}],[{key:"shuffle",value:function(e){for(var t,i,s=e.length;s>0;)i=Math.floor(Math.random()*s--),t=e[s],e[s]=e[i],e[i]=t;return e}}]),e}();
