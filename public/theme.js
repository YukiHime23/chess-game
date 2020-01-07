// **
// time step
// **
var gameTimer = null
var sec=0
var min=0

var secondsDOMElement = $('.timer-seconds');
var minutesDOMElement = $('.timer-minutes');

function startTimer() {
	// parseInt(secondsDOMElement.innerText) + 1
	sec < 10 ? secondsDOMElement.html('0'+sec) : secondsDOMElement.html(sec)
	min < 10 ? minutesDOMElement.html('0'+min) : minutesDOMElement.html(min)

	sec++
	if(sec==60) {
		sec=0
		min++
	}
}

function stopCleanTimer() {
	sec = 0
	min = 0
	gameTimer = null
}

$('#reStartBtn').on('click', function () {
	stopCleanTimer()
})

window.setInterval(startTimer,1000)

/*----------------------------------
@ event click
----------------------------------*/
$('#btnStart').on('click', function () {
 	let level = 0;
	if (document.getElementById('easy').checked) {
		level = document.getElementById('easy').value
	} else if(document.getElementById('medium').checked){
		level = document.getElementById('medium').value
	} else if(document.getElementById('hard').checked){
		level = document.getElementById('hard').value
	}
	url = "index.html?lv="+level;

 	window.location.href = url;
})
$('#btnSolo').on('click', function () {
 	window.location.href = "solo.html";
})
$('#submitSetting').on('click', function () {

})
$('.btn-help').on('click', function () {
  alert('huong dan');
})
$('.backHome').on('click', function () {
  window.location.href = "home.html";

})
$('#reStartBtn').on('click', function () {
	historyElement.empty()
	game.reset()
	board.position(game.fen())
	mod.updateStatus(game)
})
$('#test').on('click', function () {
	var draw = '4k3/4P3/4K3/8/8/8/8/8 b - - 0 78'
	var check = 'rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3'
	var test1 = 'rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq f3 0 2'
	var test2 = '4r3/8/2p2PPk/1p6/pP2p1R1/P1B5/2P2K2/3r4 w - - 1 45'
	game.load(test2)
	board.position(game.fen())
	mod.updateStatus(game)
	// console.log(board.fen())
})
$('#undo').on('click', function () {
	game.undo()
	game.undo()
	board.position(game.fen())
	mod.updateStatus(game)
  $("table.table-sm > tbody > tr:first-child").remove();
	// console.log(board.fen())
})