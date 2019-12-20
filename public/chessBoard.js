// config
var chonBen = 'black'
var toaDo = true
var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'
// initialization
var board = null
var game = new Chess()
// reference
var $status = $('#status')
var historyElement = $('#history').empty()
// function

function AiIsWhite() {
  if (chonBen === 'black') {
    if (game.turn() === 'w') {
      window.setTimeout(makeBestMove, 250)
    }
  }
}
AiIsWhite();
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
  renderMoveHistory(game.history());
  window.setTimeout(makeBestMove, 250);
  updateStatus();
}
var makeBestMove = function () {
    var bestMove = minimaxRoot(2, game, true);
    game.move(bestMove);
    board.position(game.fen());
    renderMoveHistory(game.history());
    if (game.game_over()) {
        alert('Game over'); // _______________________________________
    }
};

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
// lich su buoc di
var renderMoveHistory = function (moves) {
    historyElement.empty();
    for (var i = 0; i < moves.length; i = i + 2) {
        historyElement.append('<tr><td>' + moves[i] + '</td><td>' + ( moves[i + 1] ? moves[i + 1] : ' ') + '</td></tr>')
    }
    historyElement.scrollTop(historyElement[0].scrollHeight);
};
// Trang thai, thong tin cua van co
function updateStatus () {
  var status = ''

  var moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
  }

  // checkmate - chieu tuong
  if (game.in_checkmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.'
  }
  // draw - het nuoc co
  else if (game.in_draw()) {
    status = 'Game over, drawn position'
  }
  // van co dang dien ra
  else {
    status = moveColor + ' to move'
    // check?
    if (game.in_check()) {
      status += ', ' + moveColor + ' is in check'
    }
  }
  console.log(status);
  $status.html(status)
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

updateStatus()

$(window).resize(board.resize)
// event 

$('#reStartBtn').on('click', function () {
	historyElement.empty()
	game.reset()
	board.position(game.fen())
	updateStatus()
})
$('#test').on('click', function () {
	var draw = '4k3/4P3/4K3/8/8/8/8/8 b - - 0 78'
	var check = 'rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3'
	var test1 = 'rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq f3 0 2'
	var test2 = '4r3/8/2p2PPk/1p6/pP2p1R1/P1B5/2P2K2/3r4 w - - 1 45'
	game.load(test2)
	board.position(game.fen())
	updateStatus()
	// console.log(board.fen())
})
$('#undo').on('click', function () {
	game.undo()
	game.undo()
	board.position(game.fen())
	updateStatus()
  $("table.table-sm > tbody > tr:first-child").remove();
	// console.log(board.fen())
})
// ___________________________________________________________________-
// ___________________________________________________________________-
// ___________________________________________________________________-
// ___________________________________________________________________-
// ___________________________________________________________________-
// ___________________________________________________________________-
// setup ai
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
];;

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

// var randomMove = function() {
//   //generate all the moves for a given position
//   var moves = game.moves();
//   console.log(moves)
//   var newMove = moves[Math.floor(Math.random() * moves.length)];
//   return newMove;
// };
// var calculateBestMove = function() {
//   var newGameMoves = game.moves();
//   var bestMove = null;
//   //use any negative large number
//   var bestValue = -9999;

//   for(var i = 0; i < newGameMoves.length; i++) {
//       var newGameMove = newGameMoves[i];
//       game.move(newGameMove);

//       //take the negative as AI plays as black
//       var squaresValue = -evaluateBoard(game.SQUARES)
//       game.undo();
//       if(squaresValue > bestValue) {
//           bestValue = squaresValue;
//           bestMove = newGameMove
//       }
//   }
//   return bestMove;
// };
// var evaluateBoard = function (squares) {
//   var totalEvaluation = 0;
//   for (var i = 0; i < squares.length; i++) {
//     totalEvaluation = totalEvaluation + getPieceValue(game.get(squares[i]));
//   }
//   return totalEvaluation;
// };

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
