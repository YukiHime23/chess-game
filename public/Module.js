function Module() {
  // Trang thai, thong tin cua van co
  this.updateStatus = function(game) {
    var status = ''

    var moveColor = 'White'
    $status.addClass("whiteTurn")
    $status.removeClass("blackTurn")
    if (game.turn() === 'b') {
      moveColor = 'Black'
      $status.removeClass("whiteTurn")
      $status.addClass("blackTurn")
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
  // lich su buoc di
  this.renderMoveHistory = function (moves) {
      historyElement.empty();
      for (var i = 0; i < moves.length; i = i + 2) {
          historyElement.append('<tr><td>' + moves[i] + '</td><td>' + ( moves[i + 1] ? moves[i + 1] : ' ') + '</td></tr>')
      }
      historyElement.scrollTop(historyElement[0].scrollHeight);
  };

  this.countPiece = function(board) {
    var c = 0
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        if (board[i][j] !== null && board[i][j].color == 'b') {
          c++
        }
      }
    }
    return c 
  }

  this.getLevel = function() {
    var url = document.location.href,
        params = url.split('?')[1].split('&'),
        data = {}, tmp;
    for (var i = 0, l = params.length; i < l; i++) {
         tmp = params[i].split('=');
         data[tmp[0]] = tmp[1];
    }

    return parseInt(data.lv)
  }
}