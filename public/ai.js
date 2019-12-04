var Ai = function () {
	// body...
	var calculateBestMove =function(game) {
	    //generate all the moves for a given position
	    var newGameMoves = game.ugly_moves();
	    return newGameMoves[Math.floor(Math.random() * newGameMoves.length)];
	};
}
