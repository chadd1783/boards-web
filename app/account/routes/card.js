module.exports = function(account, board, card) {
  if (App.PUBLIC_BOARD.id) {
    this.setController(require('public-board/controller'), {
      card: card,
      board: board
    });
  } else if (!this.User.isSignedIn()) {
    this.navigate('/signin/', {trigger: true});
  } else {
    this.setController(require('account/controller'), {
      card: card,
      board: board,
      account: account
    });
  }
};
