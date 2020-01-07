/*-----------------------------------
! vẽ bàn cờ
------------------------------------*/

// initialization
var board = null
var game = new Chess()
var mod = new Module();
 // config
var chonBen = 'white'
var toaDo = true
var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'
var blackTurnOne = {
  e4:["b5","Na6","c5","g6","g5","b6","Nc6","a6","d6","Nf6"]
}
var PircDef = ["d6","Nf6"]
var franceDef=["e6","d5"]
var slavDef=["d5","c5"]
var KingDef=["Nf6","g6"]

var blackDef = {
  e4:[
    {sicilianDef:[
      {w:"e4",b:"c5"}
      ]
    },
    {CaroKannDef:[
      {w:"e4",b:"c6"}
      ]
    },
    {AlekhineDef:[
      {w:"e4",b:"Nf6"}
      ]
    },
    {franceDef:[
      {w:"e4",b:"e6"},
      {w:"d4",b:"d5"},
      ]
    },
    {PircDef:[
      {w:"e4",b:"d6"},
      {w:"d4",b:"Nf6"},
      ]
    }
  ],
  d4:[
    {slavDef:[
      {w:"d4",b:"d5"},
      {w:"c4",b:"c5"},
      ]
    },
    {KingDef:[
      {w:"d4",b:"Nf6"},
      {w:"c4",b:"g6"},
      ]
    },
  ], 
}
var whiteAtk = {
  e4:[
    {italia:[
      {w:"e4",b:"e5"},
      {w:"Nf3",b:"Nc6"},
      {w:"Bc4"},
      ]
    },
    {ruyLoper:[
      {w:"e4",b:"e5"},
      {w:"Nf3",b:"Nc6"},
      {w:"Bc5"}
      ]
    },
  ]
}
var trapMove = ["e4 e5","Nf3 Nc6","Bb5 a6","Ba4 d6","d4 b5","Bb3 Nxd4"]
// reference
var $status = $('#status')
var historyElement = $('#history').empty()
var level = mod.getLevel()

/*---------------------------------
@ Ve ban co
---------------------------------*/
function onDragStart (source, piece, position, orientation) {
  // khong cho phep di chuyen quan co neu game ket thuc
  if (game.game_over()) return false
  // chi cho phep quan co mot ben di chuyen
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}
// di chuyen neu dung luat
function onDrop (source, target) {
  
  // thong tin buoc di
  var move = game.move({
  	from: source,
  	to: target,
  	promotion: 'q'
  })

  removeGreySquares()

  // di chuyen theo luat
  if (move === null) return 'snapback'
  mod.renderMoveHistory(game.history());
  window.setTimeout(movePiece,250);
  mod.updateStatus(game);
}
// mau nuoc di duoc phep di
function removeGreySquares () { $('#board .square-55d63').css('background', '') }
function greySquare (square) {
  var $square = $('#board .square-' + square)

  var background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}
function onMouseoverSquare (square, piece) {
  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true
  })

  // exit if there are no moves available for this square
  if (moves.length === 0) return

  // highlight the square they moused over
  greySquare(square)

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to)
  }
}
function onMouseoutSquare (square, piece) {  removeGreySquares() }
// cap nhap lai vi tri tren ban co sau khi di chuyen quan co
function onSnapEnd () {
  board.position(game.fen())
}
// config chess board
var config = {
	draggable: true,
	// pieceTheme: 'img/chesspieces/alpha/{piece}.png',
	moveSpeed: 'slow',
	snapbackSpeed: 500,
	snapSpeed: 100,

	showNotation: toaDo,
	orientation: chonBen,
	position: 'start',
	onDragStart: onDragStart,
	onDrop: onDrop,
	onSnapEnd: onSnapEnd,
	onMouseoutSquare: onMouseoutSquare,
	onMouseoverSquare: onMouseoverSquare,
}
board = Chessboard('board', config)
mod.updateStatus(game)
$(window).resize(board.resize)

/*------------------------------------
@ Cai dat ai
------------------------------------*/
var reverseArray = function(array) {
    return array.slice().reverse();
};

var pawnEvalWhite = [
    [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
    [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
    [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
    [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
    [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
    [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
    [0.5,  1.0, 1.0,  -2.0, -2.0,  1.0,  1.0,  0.5],
    [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
];

var pawnEvalBlack = reverseArray(pawnEvalWhite);

var knightEval = [
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
    [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
    [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
    [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
    [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
    [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
    [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
    [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
];

var bishopEvalWhite = [
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
    [ -1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
    [ -1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
    [ -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
    [ -1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
    [ -2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

var bishopEvalBlack = reverseArray(bishopEvalWhite);

var rookEvalWhite = [
    [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
    [  0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [ -0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
    [  0.0,   0.0, 0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
];

var rookEvalBlack = reverseArray(rookEvalWhite);

var evalQueen = [
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [ -1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [  0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
    [ -1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
    [ -1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
    [ -2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

var kingEvalWhite = [

    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [ -2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [ -1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [  2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0 ],
    [  2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0 ]
];

var kingEvalBlack = reverseArray(kingEvalWhite);

var movePiece = function() {
  if (game.history().length<=4) {
    firstMove()
  } else {
    makeBestMove()
  }
}
var makeBestMove = function () {
  if (mod.countPiece(game.board())<=6) {
    l = level + 1
  }else{
    l = level
  }
  var bestMove = minimaxRoot(l, game, true);
  game.move(bestMove);
  board.position(game.fen());
  mod.renderMoveHistory(game.history());
  if (game.game_over()) {
      alert('Game over');
  }
};

var firstMove = function() {
  var his = game.history()
  switch(his[0]){
    case 'e4':
      if (his.length == 1) {
        game.move(PircDef[0])

        board.position(game.fen());
        mod.renderMoveHistory(game.history());
      }
      if (his.length == 3) {
        game.move(PircDef[1])

        board.position(game.fen());
        mod.renderMoveHistory(game.history());
      }
      break;
    case 'd4':
      if (his.length == 1) {
        game.move(KingDef[0])

        board.position(game.fen());
        mod.renderMoveHistory(game.history());
      }
      if (his.length == 3) {
        game.move(KingDef[1])

        board.position(game.fen());
        mod.renderMoveHistory(game.history());
      }
      break;
    default:
      makeBestMove()
  }
} 

var evaluateBoard = function (board) {
    var totalEvaluation = 0;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i ,j);
        }
    }
    return totalEvaluation;
};

var getPieceValue = function (piece, x, y) {
    if (piece === null) {
        return 0;
    }
    var getAbsoluteValue = function (piece, isWhite, x ,y) {
        if (piece.type === 'p') {
            return 10 + ( isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x] );
        } else if (piece.type === 'r') {
            return 50 + ( isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x] );
        } else if (piece.type === 'n') {
            return 30 + knightEval[y][x];
        } else if (piece.type === 'b') {
            return 30 + ( isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x] );
        } else if (piece.type === 'q') {
            return 90 + evalQueen[y][x];
        } else if (piece.type === 'k') {
            return 900 + ( isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x] );
        }
        throw "Unknown piece type: " + piece.type;
    };

    var absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x ,y);
    return piece.color === 'w' ? absoluteValue : -absoluteValue;
};

var minimaxRoot =function(depth, game, isMaximisingPlayer) {

    var newGameMoves = game.moves();
    var bestMove = -9999;
    var bestMoveFound;

    for(var i = 0; i < newGameMoves.length; i++) {
        var newGameMove = newGameMoves[i];
        game.move(newGameMove);
        var value = minimax(depth - 1, game, !isMaximisingPlayer);
        game.undo();
        if(value >= bestMove) {
            bestMove = value;
            bestMoveFound = newGameMove;
        }
    }
    return bestMoveFound;
};

var minimax = function (depth, game, isMaximisingPlayer) {
  if (depth === 0) {
    return -evaluateBoard(game.board());
  }
  var newGameMoves = game.moves();

  if (isMaximisingPlayer) {
    var bestMove = -9999;
    for (var i = 0; i < newGameMoves.length; i++) {
      game.move(newGameMoves[i]);
      bestMove = Math.max(bestMove, minimax(depth - 1, game, !isMaximisingPlayer));
      game.undo();
    }
    return bestMove;
  } else {
    var bestMove = 9999;
    for (var i = 0; i < newGameMoves.length; i++) {
      game.move(newGameMoves[i]);
      bestMove = Math.min(bestMove, minimax(depth - 1, game, !isMaximisingPlayer));
      game.undo();
    }
    return bestMove;
  }
}