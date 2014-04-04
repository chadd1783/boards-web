var User = require('core/models/user'),
    Cache = require('core/models/app'),
    Cards = require('core/collections/cards'),
    Boards = require('core/collections/boards'),
    Accounts = require('core/collections/accounts'),
    Comments = require('core/collections/comments');
    Collaborators = require('core/collections/collaborators');

module.exports = (function() {
  var Application = Zeppelin.Application.extend({
    routes: {
      '': require('home/routes/main'),
      'signin(/)': require('signin/routes/main'),
      'signup/?invite:token(/)': require('signup/routes/invite'),
      'signup/?token:token(/)': require('signup/routes/token'),
      'signup/step/:step(/)': require('signup/routes/step'),
      'signup(/)': require('signup/routes/main'),
      'signout/': 'signout',
      'forgot_password(/)': require('forgot-password/routes/main'),
      'reset_password/?token:token(/)': require('reset-password/routes/main'),
      'reset_password(/)': require('reset-password/routes/main'),
      'accounts(/)': require('accounts/routes/main'),
      ':account(/)': require('account/routes/main'),
      ':account/:board(/)': require('account/routes/board'),
      ':account/:board/:card(/)': require('account/routes/card')
    },

    subscriptions: {
      'router:navigate': 'goTo'
    },

    goTo: function(fragment, options) {
      options = options || {
        trigger: true
      };

      this.navigate(fragment, options);
    },

    initialize: function() {
      require('lib/config');
      require('lib/helpers');

      this.User = new User();
      this.Cache = new Cache();
      this.Cards = new Cards();
      this.Boards = new Boards();
      this.Accounts = new Accounts();
      this.Comments = new Comments();
      this.Collaborators = new Collaborators();

      this.User.signinFromCache();
    }
  });

  window.App = window.App || {};
  window.App = _.extend(new Application(), window.App);

  App.start({
    pushState: true
  });
})();
