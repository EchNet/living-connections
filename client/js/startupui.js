// startupui.js

define([ "jquery", "session", "loginui", "waitanim", "anim" ], function($, session, loginui, waitanim, anim) {

  function now() {
    return new Date().getTime();
  }

  function selectContainer() {
    return $("#startup");
  }

  function selectInner() {
    return $("#startup .inner");
  }

  function uiIsVisible() {
    return selectContainer().is(":visible");
  }

  function hideUi() {
    selectContainer().hide();
  }

  var LOGIN_TOP = -338;

  function uiIsInLoginState() {
    return selectInner().css("top") != 0;
  }

  function showInnerInPosition(top) {
    selectInner().css("top", top);
  }

  function showInnerInWaitingPosition() {
    showInnerInPosition(0);
  }

  function showInnerInLoginPosition() {
    showInnerInPosition(LOGIN_TOP);
  }

  // Class Controller

  function Controller(sessionManager) {
    var self = this;
    self.sessionManager = sessionManager;
    sessionManager.addStateChangeListener(function() {
      handleSessionManagerStateChange(self);
    });
    showWaitingState(self);
  }

  function showErrorState(self) {
    selectUnderBox().empty().html(error.render({}));
  }

  function showLoginState(self) {

    var PERIOD = 900;

    if (!self.loginController) {
      self.loginController = new loginui.Controller(self.sessionManager);
    }

    function showLoginForm() {
      showInnerInLoginPosition();
      self.loginController.show();
    }

    if (uiIsInLoginState) {
      showLoginForm();
    }
    else {
      new anim.Animation({
        period: PERIOD,
        frameTime: 1,
        iterations: 1,
        renderTween: function(frameIndex) {
          showInnerInPosition(frameIndex * TOP / PERIOD);
        },
        renderFinal: showLoginForm
      }).start();
    }
  }

  function showWaitingState(self) {
    if (!self.waitingController) {
      self.waitingController = new waitanim.Controller();
    }
    showInnerInWaitingPosition();
    self.waitingController.show().start();
  }

  function removeWaitingState(self) {
    if (self.waitingController) {
      self.waitingController.stop().hide();
    }
  }

  function handleSessionManagerStateChange(self) {
    var sessionManager = self.sessionManager;
    switch (sessionManager.state) {
    case session.STATE_IDLE:
      removeWaitingState(self);
      sessionManager.userName ? showErrorState(self) : showLoginState(self);
      break;
    case session.STATE_OPERATING:
      removeWaitingState(self);
      hideUi();
    default:
      showWaitingState(self);
    }
  }

  return {
    Controller: Controller
  }
});
