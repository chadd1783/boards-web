describe('SignupController', function() {
  var SignupController = require('controllers/signup');

  afterEach(function() {
    $('#application').empty();
  });

  describe('when instantiated.', function() {
    var signupController;

    beforeEach(function() {
      signupController = new SignupController();
    });

    it('should exist.', function() {
      expect(signupController).to.exist;
    });

    it('should render and insert.', function() {
      expect(signupController._isRendered).to.be.true;
      expect(signupController._isInserted).to.be.true;
    });

    it('should have a form child view.', function() {
      expect(signupController.getView('form')).to.exist;
    });

    afterEach(function() {
      signupController.unplug(true);
    });
  });

  describe('continueWithToken()', function() {
    var signupController;

    beforeEach(function() {
      signupController = new SignupController();
    });

    it('should set the email and signup request token in the user model if a token is passed.', function() {
      App.User.set('signup_step', 1);
      signupController.continueWithToken(JWT_SIGNUP_TOKEN);
      expect(App.User.get('email')).to.equal('someuser@example.com');
      expect(App.User.get('signup_step')).to.equal(3);
      expect(App.User.get('signup_request_token')).to.equal(JWT_SIGNUP_TOKEN);
    });

    afterEach(function() {
      signupController.unplug(true);
    });
  });
});
