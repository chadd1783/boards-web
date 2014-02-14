describe('UserModel', function() {
  var user, token, passToken, server, publishSpy,
      UserModel = require('models/user'),
      Connection = require('lib/connection');

  before(function() {
    token = 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJ0eXBlIjogIlNpZ251cFJlcXVlc3QiLCAiZW1haWwiOiAibmFtZUBleGFtcGxlLmNvbSJ9.PTbp7CGAJ3C4woorlCeWHRKqkcP7ZuiuWxn0FEiK9-0';
    passToken = 'wrongtoken';

    publishSpy = sinon.spy(UserModel.prototype, 'publish');

    user = new UserModel();

    Boards.Connection = new Connection({
      type: 'HTTP',
      httpUrl: '/api/'
    });
  });

  beforeEach(function() {
    server = sinon.fakeServer.create();
    server.autoRespond = false;
    server.autoRespondAfter = 500;
  });

  afterEach(function() {
    server.restore();
  });

  after(function() {
    user.clear();
    localStorage.clear();
    UserModel.prototype.publish.restore();
  });

  it('should exist.', function() {
    expect(user).to.exist;
  });

  it('should have a name.', function() {
    expect(user.name).to.equal('User');
  });

  describe('requestSignup', function() {
    it('should return a promise.', function() {
      var url = '/api/auth/signup_request/',
          contentType = {"Content-Type":"application/json"};

      server.respondWith('POST', url, [200, contentType, 'OK']);
      expect(user.requestSignup().promise).to.exist;
      server.respond();
    });
  });

  describe('setEmailFromJWT', function() {
    it('should set the email decoded from the given JWT.', function() {
      user.setEmailFromJWT(token);
      expect(user.get('email')).to.equal('name@example.com');
      expect(user.get('signup_request_token')).to.equal(token);
    });
  });

  describe('isWaitingForEmailValidation', function() {
    it('should check if the user is waiting for the signup request email.', function() {
      expect(user.isWaitingForEmailValidation()).to.be.false;
      user.setEmailFromJWT(token).set('signup_step', 2);
      expect(user.isWaitingForEmailValidation()).to.be.true;
    });
  });

  describe('updateSignupStep', function() {
    it('should update the signup_step attribute and update the cache.', function() {
      user.updateSignupStep(1);
      expect(user.get('signup_step')).to.equal(1);
      expect(user.cache.get('signup_step')).to.equal(1);
      user.updateSignupStep(5);
      expect(user.get('signup_step')).to.equal(5);
      expect(user.cache.get('signup_step')).to.equal(5);
    });
  });

  describe('validateSignupEmailDomain', function() {
    it('should return a promise.', function() {
      var url = '/api/auth/signup_domains/validate/',
          contentType = {"Content-Type":"application/json"};

      server.respondWith('POST', url, [200, contentType, 'OK']);
      expect(user.validateSignupEmailDomain().promise).to.exist;
      server.respond();
    });
  });

  describe('hasInviteDomains', function() {
    it('should check if the user set any signup domains.', function() {
      expect(user.hasInviteDomains()).to.be.false;
      user.set('signup_domains', ['blimp.io', 'getblimp.com'])
      expect(user.hasInviteDomains()).to.be.true;
    });
  });

  describe('validateUsername', function() {
    it('should return a promise.', function() {
      var url = '/api/auth/username/validate/',
          contentType = {"Content-Type":"application/json"};

      server.respondWith('POST', url, [200, contentType, 'OK']);
      expect(user.validateUsername().promise).to.exist;
      server.respond();
    });
  });

  describe('signup', function() {
    it('should return a promise.', function() {
      var url = '/api/auth/signup/',
          contentType = {"Content-Type":"application/json"};

      server.respondWith('POST', url, [200, contentType, 'OK']);
      expect(user.signup().promise).to.exist;
      server.respond();
    });
  });

  describe('isSignedIn', function() {
    it('should return true when the user is logged in.', function() {
      user.set({token: '123456789098765432'});
      expect(user.isSignedIn()).to.be.true;
    });

    it('should return false when the user is not logged in.', function() {
      user.unset('token');
      expect(user.isSignedIn()).to.be.false;
    });
  });

  describe('signin', function() {
    it('should return a promise.', function() {
      var url = '/api/auth/signin/',
          contentType = {"Content-Type":"application/json"};

      server.respondWith('POST', url, [200, contentType, 'OK']);
      expect(user.signin().promise).to.exist;
      server.respond();
    });
  });

  describe('signout', function() {
    it('should signout the user.', function() {
      user.set({
        email: 'email@example.com',
        username: 'fulano',
        token: '1234567890'
      }).saveCache();

      expect(user.has('email')).to.be.true;
      expect(user.has('username')).to.be.true;
      expect(user.has('token')).to.be.true;
      expect(user.cache.get('token')).to.exist;

      user.signout();

      expect(user.has('email')).to.be.false;
      expect(user.has('username')).to.be.false;
      expect(user.has('token')).to.be.false;
      expect(user.cache.get('token')).to.not.exist;
    });
  });

  describe('forgotPassword', function() {
    it('should return a promise.', function() {
      var url = '/api/auth/forgot_password/',
          contentType = {"Content-Type":"application/json"};

      server.respondWith('POST', url, [200, contentType, 'OK']);
      expect(user.forgotPassword().promise).to.exist;
      server.respond();
    });
  });

  describe('setPasswordResetDataFromJWT', function() {
    it('should set password reset data decoded from a JWT.', function() {
      user.setPasswordResetDataFromJWT(passToken);
      expect(user.get('passwordResetData')).to.exist;
      expect(user.get('passwordResetData').id).to.exist;
      expect(user.get('passwordResetData').type).to.exist;
      expect(user.get('passwordResetData').token).to.exist;
      expect(user.get('passwordResetData').version).to.exist;
    });
  });

  describe('canResetPassword', function() {
    it('should return false if the user is not logged in.', function() {
      user.clear().cache.clearAll();
      expect(user.canResetPassword()).to.not.be.ok;
    });

    it('should return true if the user is logged in.', function() {
      user.clear().cache.clearAll();
      user.set('token', token);
      expect(user.canResetPassword()).to.be.true;
    });

    it('should return true if the user has password reset token.', function() {
      user.clear().cache.clearAll();
      user.setPasswordResetDataFromJWT(passToken);
      expect(user.canResetPassword()).to.be.true;
    });
  });

  describe('resetPassword', function() {
    it('should return a promise.', function() {
      var url = '/api/auth/forgot_password/',
          contentType = {"Content-Type":"application/json"};

      server.respondWith('POST', url, [200, contentType, 'OK']);
      user.setPasswordResetDataFromJWT(passToken);
      expect(user.resetPassword('password1').promise).to.exist;
      server.respond();
    });
  });

  describe('fetchAccounts', function() {
    it('should publish a user:accounts:fetched event with the accounts.', function(done) {
      var url = '/api/accounts/',
          contentType = {"Content-Type":"application/json"};

      server.respondWith('GET', url, [200, contentType, '{"accounts": []}']);
      user.fetchAccounts();

      setTimeout(function() {
        expect(publishSpy).to.have.calledWith('user:accounts:fetched');
        done();
      }, 600);

      server.respond();
    });
  });
});
