// config
var chonBen = 'white'
var toaDo = false
var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'
// initialization
var board = null
var game = new Chess()
// reference
var $status = $('#status')
var historyElement = $('#history').empty()
// function

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
	// board.flip()

	renderMoveHistory(game.history())
	updateStatus()
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
// lich su buoc di
var renderMoveHistory = function (moves) {
    historyElement.empty();
    for (var i = 0; i < moves.length; i = i + 2) {
        historyElement.append('<span>' + moves[i] + ' ' + ( moves[i + 1] ? moves[i + 1] : ' ') + '</span><br>')
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
  $status.html(status)
}
// config chess board
var config = {
	draggable: true,
	dropOffBoard: 'snapback',
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
	board.position(game.fen())
	updateStatus()
	// console.log(board.fen())
})
var calculateBestMove =function(game) {
    //generate all the moves for a given position
    var newGameMoves = game.ugly_moves();
    return newGameMoves[Math.floor(Math.random() * newGameMoves.length)];
};