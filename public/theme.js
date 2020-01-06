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
$('.btn-start').on('click', function () {
	window.location.href = "index.html";
})
$('.btn-setting').on('click', function () {
	alert("Cai dat");
})
$('.btn-help').on('click', function () {
	alert('huong dan');
})
$('.backHome').on('click', function () {
	window.location.href = "home.html";
})