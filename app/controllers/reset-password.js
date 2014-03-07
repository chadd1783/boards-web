module.exports = Zeppelin.View.extend({
  name: 'ResetPasswordController',

  template: require('templates/reset-password'),

  initialize: function() {
    document.title = 'Blimp | Reset Password';
    return this;
  },

  onInsert: function() {
    this.initChildren();
    return this;
  },

  validateToken: function(token) {
    if (token) App.User.setPasswordResetDataFromJWT(token);
    if (App.User.canResetPassword()) this.insert('#application');
    return this;
  },

  initChildren: function() {
    this.addChild(_.createView('reset-password-form'), 'form').render();
    return this;
  }
});
