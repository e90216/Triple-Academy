/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var View = __webpack_require__(1);
	var Game = __webpack_require__(4);
	
	$(function () {
	  var $rootEl = $('.ta');
	
	  // $playButton = $("<button>").addClass("play-button").html("Start!");
	  // $rootEl.append($playButton);
	
	
	  var game = new Game();
	  var view = new View(game, $rootEl);
	  view.setupBoard();
	  view.bindEvents();
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// const ImgConstants = require('./constants/img_constants');
	var ImgValueConstants = __webpack_require__(2);
	var InstructionConstants = __webpack_require__(3);
	
	var View = function View(game, $el) {
	  this.game = game;
	  this.$el = $el;
	};
	
	View.prototype.bindEvents = function () {
	  var _this = this;
	
	  //when cell is clicked, check if empty, then send cell to make move
	  var that = this;
	
	  var currentImg = void 0;
	  $(".cell").hover(function (event) {
	    if ($(event.currentTarget).html() === "") {
	
	      $(event.currentTarget).addClass("zoom");
	
	      $(event.currentTarget).html(that.game.currentPiece.imgTag);
	      currentImg = undefined;
	
	      var cellNo = parseInt($(event.currentTarget).attr("data-number"));
	
	      var currentVal = that.game.currentPiece.value;
	      var adjacents = that.game.adjacentMatchingPositions([Math.floor(cellNo / 5), cellNo % 5], currentVal);
	      while (adjacents.length >= 2) {
	        currentVal++;
	        that.game.adjacentTop.forEach(function (adjacentPos) {
	          $('.cell[data-number=' + (adjacentPos[0] * 5 + adjacentPos[1]) + ']').addClass("bounce-down");
	        });
	        that.game.adjacentBottom.forEach(function (adjacentPos) {
	          $('.cell[data-number=' + (adjacentPos[0] * 5 + adjacentPos[1]) + ']').addClass("bounce-up");
	        });
	        that.game.adjacentLeft.forEach(function (adjacentPos) {
	          $('.cell[data-number=' + (adjacentPos[0] * 5 + adjacentPos[1]) + ']').addClass("bounce-right");
	        });
	        that.game.adjacentRight.forEach(function (adjacentPos) {
	          $('.cell[data-number=' + (adjacentPos[0] * 5 + adjacentPos[1]) + ']').addClass("bounce-left");
	        });
	        adjacents = that.game.adjacentMatchingPositions([Math.floor(cellNo / 5), cellNo % 5], currentVal);
	      }
	    } else {
	      //there is already an image there
	      currentImg = $(event.currentTarget).html();
	      //display the instructions for this piece from instruction constants
	      $(".instructions").html(InstructionConstants[currentImg.slice(26, -7)]);
	    }
	  }, function (event) {
	    $(event.currentTarget).html(currentImg ? currentImg : "");
	    $(".cell").removeClass("bounce-down bounce-up bounce-right bounce-left");
	    $(".instructions").html("Hover over an object for instructions!");
	  });
	
	  $(".cell").on("click", function (event) {
	    var cellNo = parseInt($(event.currentTarget).attr("data-number"));
	    if (_this.game.board.grid[Math.floor(cellNo / 5)][cellNo % 5] === "") {
	      _this.makeMove($(event.currentTarget));
	      // $(event.currentTarget).addClass("has-piece");
	    }
	    $(".cell").removeClass("bounce-down bounce-up bounce-right bounce-left zoom");
	  });
	};
	
	View.prototype.unbindClick = function () {
	  $(".cell").off("click");
	};
	
	View.prototype.makeMove = function ($cell) {
	  // console.log(this.game.board.grid);
	  // debugger
	  var cellNo = parseInt($cell.attr("data-number"));
	  var cellPos = [Math.floor(cellNo / 5), cellNo % 5];
	  this.game.playMove(cellPos);
	  //render new board
	  var that = this;
	  this.game.changed.forEach(function (changedPos) {
	    var changedCellNo = changedPos[0] * 5 + changedPos[1];
	    $('.cell[data-number=' + changedCellNo + ']').html(that.game.board.grid[changedPos[0]][changedPos[1]].imgTag ? that.game.board.grid[changedPos[0]][changedPos[1]].imgTag : "");
	  });
	  //also render new current piece
	  $('.current-piece').html("next:" + this.game.currentPiece.imgTag);
	
	  if (this.game.won) {
	    this.unbindClick();
	    this.$el.addClass("game-won");
	    console.log("you did it, really. good work.");
	    $(".cell").html(ImgValueConstants[7]);
	    $(".current-piece").html("<p>EXPECTED BEHAVIOR!!!</p>");
	  } else if (this.game.isOver()) {
	    this.unbindClick();
	    this.$el.addClass("game-over");
	    $(".container").append($("<marquee>GAME OVER</marquee>").addClass("game-over-message"));
	    console.log("it's over. seriously.");
	  }
	};
	
	View.prototype.setupBoard = function () {
	  var $container = $("<div>").addClass("container");
	
	  var grid = $("<ul>").addClass("grid").addClass("group");
	
	  for (var i = 0; i < 25; i++) {
	    var $cell = $("<li>").addClass("cell");
	    $cell.attr("data-number", i);
	    // cell.html(i);
	    grid.append($cell);
	  }
	
	  this.$el.append($container);
	  $container.append(grid); //set up the grid for the pieces to be places
	
	  this.game.generateInitialSetup();
	  this.game.pieces.forEach(function (piece) {
	    $('.cell[data-number=' + piece.getCellNo() + ']').html(piece.imgTag);
	  });
	
	  //make a separate place to hold to current piece to be placed
	  $container.append($("<div>").addClass("current-piece"));
	  $('.current-piece').html("next:" + this.game.currentPiece.imgTag);
	
	  $container.append($("<div>").addClass("instructions"));
	  $(".instructions").html("Hover over an object for instructions!");
	};
	
	module.exports = View;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	var ImgValueConstants = {
	  // "<img src=\"./images/grass.png\" >": 0,
	  // "<img src=\"./images/bush.png\" >": 1,
	  // "<img src=\"./images/tree.png\" >": 2,
	  // "<img src=\"./images/hut.png\" >": 3,
	  // "<img src=\"./images/house.png\" >": 4,
	  // "<img src=\"./images/mansion.png\" >": 5,
	  // "<img src=\"./images/castle.png\" >": 6,
	
	  "bear": 0,
	  "grass": 1,
	  "bush": 2,
	  "tree": 3,
	  "hut": 4,
	  "house": 5,
	  "mansion": 6,
	  "aa": 7,
	  // "floatingcastle": 8,
	  // "aa": 9,
	
	  0: "<img src=\"./assets/images/bear2.png\" >",
	  1: "<img src=\"./assets/images/grass2.png\" >",
	  2: "<img src=\"./assets/images/bush2.png\" >",
	  3: "<img src=\"./assets/images/tree2.png\" >",
	  4: "<img src=\"./assets/images/hut2.png\" >",
	  5: "<img src=\"./assets/images/house2.png\" >",
	  6: "<img src=\"./assets/images/mansion2.png\" >",
	  7: "<img src=\"./assets/images/aa2.png\" >"
	  // 8 : "<img src='./images/floatingcastle2.png' >",
	  // 9 : "<img src='./images/aa.png' >"
	};
	
	module.exports = ImgValueConstants;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var ImgValueConstants = __webpack_require__(2);
	
	var InstructionConstants = {
	  "grass": "<div>" + ImgValueConstants[1] + " + " + ImgValueConstants[1] + " + " + ImgValueConstants[1] + " = " + ImgValueConstants[2] + "</div>",
	  "bush": "<div>" + ImgValueConstants[2] + " + " + ImgValueConstants[2] + " + " + ImgValueConstants[2] + " = " + ImgValueConstants[3] + "</div>",
	  "tree": "<div>" + ImgValueConstants[3] + " + " + ImgValueConstants[3] + " + " + ImgValueConstants[3] + " = " + ImgValueConstants[4] + "</div>",
	  "hut": "<div>" + ImgValueConstants[4] + " + " + ImgValueConstants[4] + " + " + ImgValueConstants[4] + " = " + ImgValueConstants[5] + "</div>",
	  "house": "<div>" + ImgValueConstants[5] + " + " + ImgValueConstants[5] + " + " + ImgValueConstants[5] + " =  YOU WIN!!!</div>"
	  // mansion: `${ImgValueConstants[1]} + ${ImgValueConstants[1]} + ${ImgValueConstants[1]} = ${ImgValueConstants[1]}`,
	  // castle: `${ImgValueConstants[1]} + ${ImgValueConstants[1]} + ${ImgValueConstants[1]} = ${ImgValueConstants[1]}`
	};
	
	module.exports = InstructionConstants;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var ImgConstants = __webpack_require__(5);
	var ImgValueConstants = __webpack_require__(2);
	var Board = __webpack_require__(6);
	var Piece = __webpack_require__(7);
	// const Bear = require('./bear');
	
	function Game() {
	  this.board = new Board();
	  this.pieces = [];
	  this.currentPiece = this.giveCurrentPiece();
	  this.changed = [];
	
	  this.adjacentTop = [];
	  this.adjacentBottom = [];
	  this.adjacentLeft = [];
	  this.adjacentRight = [];
	
	  this.won = false;
	
	  // this.bears = [];
	}
	
	Game.prototype.playMove = function (clickedCellPos) {
	  this.changed = [clickedCellPos];
	  this.updatePos(clickedCellPos, this.currentPiece);
	
	  // if(this.currentPiece instanceof Bear) {
	  //   debugger
	  //   let adjacentEmptys = this.getAdjacentEmptys(clickedCellPos);
	  //   let newPos = this.currentPiece.walk(adjacentEmptys);
	  // }
	
	  var adjacentPositions = this.adjacentMatchingPositions(clickedCellPos);
	  while (adjacentPositions.length >= 2) {
	    // console.log("time to combine!");
	    var biggerPiece = this.combine(clickedCellPos, adjacentPositions); //combine them
	
	    if (biggerPiece.value === 6) {
	      console.log("YOU WIN!!!!!!!! YAAAAAYYYYYYY");
	      this.won = true;
	    }
	
	    adjacentPositions = this.adjacentMatchingPositions(clickedCellPos, biggerPiece.value); //check that that doesn't need to be combined
	  }
	
	  if (this.isOver()) {
	    console.log("IT'S OVER. STOP PLAYING");
	  } else {
	    this.currentPiece = this.giveCurrentPiece();
	  }
	};
	
	Game.prototype.updatePos = function (pos, piece) {
	  this.board.grid[pos[0]][pos[1]] = piece;
	  piece.pos = pos;
	};
	
	Game.prototype.isOver = function () {
	  return this.board.isFull();
	};
	
	Game.prototype.getAdjacentEmptys = function (pos) {
	  var row = pos[0];
	  var col = pos[1];
	
	  var emptys = [];
	
	  var topPos = [row - 1, col];
	  var bottomPos = [row + 1, col];
	  var leftPos = [row, col - 1];
	  var rightPos = [row, col + 1];
	
	  if (this.board.grid[topPos[0][topPos[1]]] === "") {
	    emptys.push(topPos);
	  }
	  if (this.board.grid[bottomPos[0][bottomPos[1]]] === "") {
	    emptys.push(bottomPos);
	  }
	  if (this.board.grid[leftPos[0][leftPos[1]]] === "") {
	    emptys.push(leftPos);
	  }
	  if (this.board.grid[rightPos[0][rightPos[1]]] === "") {
	    emptys.push(rightPos);
	  }
	
	  return emptys;
	};
	
	Game.prototype.adjacentMatchingPositions = function (gridPos, pieceValue) {
	  //reset the adjacent arrays
	  this.adjacentTop = [];
	  this.adjacentBottom = [];
	  this.adjacentLeft = [];
	  this.adjacentRight = [];
	
	  var row = gridPos[0];
	  var col = gridPos[1];
	
	  if (!pieceValue) {
	    //pieceValue is a string
	    pieceValue = this.currentPiece.value;
	  }
	
	  var adjacents = []; //to keep track of adjacent same objects
	
	  //check all adjacent cells to check if same piece
	  var topPos = [row - 1, col];
	  var bottomPos = [row + 1, col];
	  var leftPos = [row, col - 1];
	  var rightPos = [row, col + 1];
	
	  var that = this;
	  //if not top row
	  if (row > 0 && this.board.grid[topPos[0]][topPos[1]].value === pieceValue) {
	    //top
	    // debugger
	    adjacents.push(topPos); //adjacents.concat(this.adjacentMatchingPositions(topPos, pieceValue, thirdParamToExcludeBottomPosCheck?));
	    that.adjacentTop.push(topPos);
	    if (topPos[0] > 0 && this.board.grid[topPos[0] - 1][topPos[1]].value === pieceValue) {
	      //top
	      adjacents.push([topPos[0] - 1, topPos[1]]);
	      that.adjacentTop.push([topPos[0] - 1, topPos[1]]);
	    }
	    if (topPos[1] % 5 > 0 && this.board.grid[topPos[0]][topPos[1] - 1].value === pieceValue) {
	      //left
	      adjacents.push([topPos[0], topPos[1] - 1]);
	      that.adjacentLeft.push([topPos[0], topPos[1] - 1]);
	      that.adjacentTop.push([topPos[0], topPos[1] - 1]);
	    }
	    if (topPos[1] % 5 < 4 && this.board.grid[topPos[0]][topPos[1] + 1].value === pieceValue) {
	      //right
	      adjacents.push([topPos[0], topPos[1] + 1]);
	      that.adjacentRight.push([topPos[0], topPos[1] + 1]);
	      that.adjacentTop.push([topPos[0], topPos[1] + 1]);
	    }
	  }
	
	  //if not bottom row
	  if (row < 4 && this.board.grid[bottomPos[0]][bottomPos[1]].value === pieceValue) {
	    //bottom
	    // debugger
	    adjacents.push(bottomPos); //= this.adjacentMatchingPositions(Pos, pieceValue);
	    that.adjacentBottom.push(bottomPos);
	    if (bottomPos[0] < 4 && this.board.grid[bottomPos[0] + 1][bottomPos[1]].value === pieceValue) {
	      //bottom
	      adjacents.push([bottomPos[0] + 1, bottomPos[1]]);
	      that.adjacentBottom.push([bottomPos[0] + 1, bottomPos[1]]);
	    }
	    if (bottomPos[1] % 5 > 0 && this.board.grid[bottomPos[0]][bottomPos[1] - 1].value === pieceValue) {
	      //left
	      adjacents.push([bottomPos[0], bottomPos[1] - 1]);
	      that.adjacentLeft.push([bottomPos[0], bottomPos[1] - 1]);
	      that.adjacentBottom.push([bottomPos[0], bottomPos[1] - 1]);
	    }
	    if (bottomPos[1] % 5 < 4 && this.board.grid[bottomPos[0]][bottomPos[1] + 1].value === pieceValue) {
	      //right
	      adjacents.push([bottomPos[0], bottomPos[1] + 1]);
	      that.adjacentRight.push([bottomPos[0], bottomPos[1] + 1]);
	      that.adjacentBottom.push([bottomPos[0], bottomPos[1] + 1]);
	    }
	  }
	
	  //if not left-most col
	  if (col % 5 > 0 && this.board.grid[leftPos[0]][leftPos[1]].value === pieceValue) {
	    //left
	    // debugger
	    adjacents.push(leftPos); // = this.adjacentMatchingPositions(Pos, pieceValue);
	    that.adjacentLeft.push(leftPos);
	    if (leftPos[0] > 0 && this.board.grid[leftPos[0] - 1][leftPos[1]].value === pieceValue) {
	      //top
	      adjacents.push([leftPos[0] - 1, leftPos[1]]);
	      that.adjacentTop.push([leftPos[0] - 1, leftPos[1]]);
	      that.adjacentLeft.push([leftPos[0] - 1, leftPos[1]]);
	    }
	    if (leftPos[0] < 4 && this.board.grid[leftPos[0] + 1][leftPos[1]].value === pieceValue) {
	      //bottom
	      adjacents.push([leftPos[0] + 1, leftPos[1]]);
	      that.adjacentBottom.push([leftPos[0] + 1, leftPos[1]]);
	      that.adjacentLeft.push([leftPos[0] + 1, leftPos[1]]);
	    }
	    if (leftPos[1] % 5 > 0 && this.board.grid[leftPos[0]][leftPos[1] - 1].value === pieceValue) {
	      //left
	      adjacents.push([leftPos[0], leftPos[1] - 1]);
	      that.adjacentLeft.push([leftPos[0], leftPos[1] - 1]);
	    }
	  }
	
	  //if not right-most col
	  if (col % 5 < 4 && this.board.grid[rightPos[0]][rightPos[1]].value === pieceValue) {
	    //right
	    // debugger
	    adjacents.push(rightPos); // = this.adjacentMatchingPositions(Pos, pieceValue);
	    that.adjacentRight.push(rightPos);
	    if (rightPos[0] > 0 && this.board.grid[rightPos[0] - 1][rightPos[1]].value === pieceValue) {
	      //top
	      adjacents.push([rightPos[0] - 1, rightPos[1]]);
	      that.adjacentTop.push([rightPos[0] - 1, rightPos[1]]);
	      that.adjacentRight.push([rightPos[0] - 1, rightPos[1]]);
	    }
	    if (rightPos[0] < 4 && this.board.grid[rightPos[0] + 1][rightPos[1]].value === pieceValue) {
	      //bottom
	      adjacents.push([rightPos[0] + 1, rightPos[1]]);
	      that.adjacentBottom.push([rightPos[0] + 1, rightPos[1]]);
	      that.adjacentRight.push([rightPos[0] + 1, rightPos[1]]);
	    }
	    if (rightPos[1] % 5 < 4 && this.board.grid[rightPos[0]][rightPos[1] + 1].value === pieceValue) {
	      //right
	      adjacents.push([rightPos[0], rightPos[1] + 1]);
	      that.adjacentRight.push([rightPos[0], rightPos[1] + 1]);
	    }
	  }
	
	  return adjacents;
	};
	
	Game.prototype.combine = function (cellPos, adjacentPositions) {
	  var that = this;
	  //clear adjacent cells and put bigger piece in cell (or return new piece)
	  adjacentPositions.forEach(function (pos) {
	    //clear adjacent cells
	    that.board.grid[pos[0]][pos[1]] = "";
	    that.changed.push(pos);
	  });
	  var newValue = this.board.grid[cellPos[0]][cellPos[1]].value + 1;
	  var biggerPiece = new Piece(ImgValueConstants[newValue].slice(26, -8), cellPos);
	  this.board.grid[cellPos[0]][cellPos[1]] = biggerPiece;
	
	  return biggerPiece;
	};
	
	Game.prototype.giveCurrentPiece = function () {
	  //pick random piece (from: grass, bush, tree, hut, bear)
	  var randomType = ImgConstants[Math.floor(Math.random() * (52 - 1) + 1)];
	
	  var randomCellNo = Math.floor(Math.random() * 25);
	  var pos = [Math.floor(randomCellNo / 5), randomCellNo % 5];
	
	  // if(randomType === "bear") {
	  //   return new Bear(pos);
	  // } else {
	  return new Piece(randomType, pos);
	  // }
	};
	
	Game.prototype.generateInitialSetup = function () {
	  //place random pieces (from: grass, bush, tree, hut) in random cells
	  //- some number of pieces between 5-7
	  var numPieces = Math.floor(Math.random() * (8 - 5) + 5);
	
	  for (var i = 0; i < numPieces; i++) {
	    var randomType = ImgConstants[Math.floor(Math.random() * (52 - 1) + 1)];
	
	    var randomCellNo = Math.floor(Math.random() * 25);
	    var pos = [Math.floor(randomCellNo / 5), randomCellNo % 5];
	
	    // make sure cell is empty else do it again
	    // and also make sure this piece is not adjacent to 2+ of the same piece
	    while (this.board.grid[pos[0]][pos[1]] !== "") {
	      // console.log("oops! there's already something there!");
	      randomCellNo = Math.floor(Math.random() * 25);
	      pos = [Math.floor(randomCellNo / 5), randomCellNo % 5];
	
	      //also check adjacents in here?
	    }
	
	    var adjacentPositions = this.adjacentMatchingPositions(pos, ImgValueConstants[randomType]);
	    // console.log(`number of adjacent pos: ${adjacentPositions.length}`);
	    while (adjacentPositions.length >= 2) {
	      // console.log("oops! close call. we'd need to combine!"); //ether pick a diff cell here or combine
	      randomCellNo = Math.floor(Math.random() * 25);
	      pos = [Math.floor(randomCellNo / 5), randomCellNo % 5];
	      adjacentPositions = this.adjacentMatchingPositions(pos, ImgValueConstants[randomType]);
	    }
	
	    var randomPiece = new Piece(randomType, pos);
	    this.pieces.push(randomPiece);
	    this.board.grid[pos[0]][pos[1]] = randomPiece;
	  }
	};
	
	module.exports = Game;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	//for initial setup (piece randomization)
	
	var ImgConstants = {
	  1: "grass",
	  2: "grass",
	  3: "grass",
	  4: "grass",
	  5: "grass",
	  6: "grass",
	  7: "grass",
	  8: "grass",
	  9: "grass",
	  10: "grass",
	  11: "grass",
	  12: "grass",
	  13: "grass",
	  14: "grass",
	  15: "grass",
	  16: "grass",
	  17: "grass",
	  18: "grass",
	  19: "grass",
	  20: "grass",
	  21: "grass",
	  22: "grass",
	  23: "grass",
	  24: "grass",
	  25: "grass",
	  26: "grass",
	  27: "grass",
	  28: "grass",
	  29: "grass",
	  30: "grass",
	  31: "grass",
	  32: "grass",
	  33: "grass",
	  34: "grass",
	  35: "grass",
	
	  36: "bush",
	  37: "bush",
	  38: "bush",
	  39: "bush",
	  40: "bush",
	  41: "bush",
	  42: "bush",
	  43: "bush",
	  44: "bush",
	  45: "bush",
	  46: "bush",
	  47: "bush",
	  48: "bush",
	
	  49: "tree",
	  50: "tree",
	
	  51: "hut",
	
	  52: "bear"
	};
	
	module.exports = ImgConstants;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	
	// const Piece = require('./piece');
	
	var Board = function Board() {
	  this.grid = this.makeGrid();
	};
	
	// Board.prototype.isWon = function () {
	//
	// };
	
	// Board.prototype.grid = function (pos) {
	//   return this.grid[pos[0]][pos[1]];
	// };
	
	Board.prototype.isFull = function () {
	  for (var i = 0; i < 5; i++) {
	    for (var j = 0; j < 5; j++) {
	      if (this.grid[i][j] === "") {
	        return false;
	      }
	    }
	  }
	
	  return true;
	};
	
	Board.prototype.makeGrid = function () {
	  var grid = [];
	  for (var i = 0; i < 5; i++) {
	    grid.push([]);
	    for (var j = 0; j < 5; j++) {
	      grid[i].push("");
	    }
	  }
	  return grid;
	};
	
	// Board.prototype.placePiece = function (pos) {
	//
	// };
	
	
	module.exports = Board;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var ImgValueConstants = __webpack_require__(2);
	
	var Piece = function Piece(type, cellPos) {
	  this.type = type;
	
	  this.pos = cellPos; //[row, col]
	  // this.cellNo = cellPos[0] * 5 + cellPos[1];
	
	  this.value = ImgValueConstants[type];
	
	  this.imgTag = ImgValueConstants[this.value];
	  // debugger
	};
	
	Piece.prototype.getCellNo = function () {
	  return this.pos[0] * 5 + this.pos[1];
	};
	
	// Piece.prototype.render = function () {
	//   return this.imgTag; //or call this getImg()
	// };
	
	Piece.prototype.combine = function () {
	  //this should take care of the logic of becoming the next level object...
	  //bear will rewrite this
	};
	
	module.exports = Piece;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map