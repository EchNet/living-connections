// index.js
// Living Connections main module
//
define([ "jquery", "bootui", "session", "anim", "error" ], function($, bootui, session, anim, error) {

  function selectStartupScreen() {
    return $(".startup");
  }

  function selectInner() {
    return selectStartupScreen().find(".inner");
  }

  function selectUnderBox() {
    return selectStartupScreen().find(".under");
  }

  function eraseBootUi() {
    selectStartupScreen().empty();
  }

  function startBootAnimation() {
    return new bootui.WaitingAnimation(selectUnderBox()).start();
  }

  var EMAIL_REGEX = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;

  function isValidEmail(str) {
    return str.match(EMAIL_REGEX);
  }

  function showLogin(sessionManager, doAnimation) {

    var label = $("<div>").text("Log in with your email address:");
    var input = $("<input>").attr("type", "text");
    var button = $("<button>").text("Go!");
    var validationErrorBox = $("<div>").addClass("error");

    function removeValidation() {
      input.removeClass("invalid");
      validationErrorBox.text("");
    }

    function showInvalid(msg) {
      input.addClass("invalid");
      input.select();
      validationErrorBox.text(msg);
    }

    function submit() {
      var text = input.val();
      if (text) {
        if (isValidEmail(text)) {
          sessionManager.logInWithEmail(text)
          .then(function() {
            showApp(sessionManager);
          })
          .catch(function(e) {
            showInvalid("Login failed.");
          })
        }
        else {
          showInvalid("Invalid email.");
        }
      }
    }

    function handleLoginClick(event) {
      submit();
      return true;
    }

    function handleKeyDown(event) {
      removeValidation();
      if (event.originalEvent.keyCode == 13) {
        submit();
      }
      return true;
    }

    var TOP = -338;
    var PERIOD = 900;

    function showInnerInPosition(top) {
      selectInner().css("top", top);
    }

    function showInnerInFinalPosition() {
      showInnerInPosition(TOP);
    }

    function renderLoginForm() {
      showInnerInFinalPosition();

      input.on("keydown", handleKeyDown)
      button.click(handleLoginClick);

      selectUnderBox()
        .empty()
        .append($("<div>")
          .addClass("login")
          .append(label)
          .append($("<div>")
            .append(input)
            .append(button))
          .append(validationErrorBox)
        );
      input.focus();
    }

    if (doAnimation) {
      new anim.Animation({
        period: PERIOD,
        frameTime: 1,
        iterations: 1,
        renderTween: function(frameIndex) {
          showInnerInPosition(frameIndex * TOP / PERIOD);
        },
        renderFinal: renderLoginForm
      }).start();
    }
    else {
      renderLoginForm();
    }
  }

  function showApp(sessionManager) {
    if (sessionManager.userName) {
      eraseBootUi();
      $("body").append($("<p>").text("Welcome, " + sessionManager.userName));
    }
    else {
      showLogin(sessionManager, true);
    }
  }

  function showError(e) {
    selectUnderBox().empty().html(error.render(e));
  }

  return function() {
    var sessionManager = new session.Manager();
    var bootAnimation = startBootAnimation();
    sessionManager.init()
      .always(function() { bootAnimation.stop(); })
      .done(function() { showApp(sessionManager); })
      .fail(showError);
  }
});
