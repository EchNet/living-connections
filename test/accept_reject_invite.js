var expect = require("chai").expect;
const requestlc = require("./common/requestlc");

const GREETING_TYPE = 0;
const INVITE_TYPE = 1;

const ACCEPT = "accept";
const REJECT = "reject";

requestlc.describe("Messages API (invitation actions)", function(client) {

  // Methods...

  function createMessage(type, fromUserId, toUserId) {
    return client.makeRequest("POST", "/api/messages")
    .withData({
      toUserId: toUserId,
      assetId: 17,
      type: type
    })
    .asUser(fromUserId).expectStatusCode(200).getJson().go();
  }

  function retrieveConnection(userId, peerId) {
    return client.makeRequest("GET", "/api/connections/" + userId + "/" + peerId)
    .asRoot().expectStatusCode(200).getJson().go();
  }

  function actOnInviteOk(action, messageId, userId) {
    return client.makeRequest("GET", "/api/messages/" + messageId + "?act=" + action)
    .asUser(userId).expectStatusCode(200).getJson().go();
  }

  function actOnInviteError(action, messageId, userId, expectedStatusCode) {
    return client.makeRequest("GET", "/api/messages/" + messageId + "?act=" + action)
    .asUser(userId).expectStatusCode(expectedStatusCode).go();
  }

  // Tests...

  it("creates connection when invitation is accepted", function(done) {
    var FROM_USER_ID = 1;
    var TO_USER_ID = 2;
    createMessage(INVITE_TYPE, FROM_USER_ID, TO_USER_ID)
    .then(function(message) {
      return actOnInviteOk(ACCEPT, message.id, TO_USER_ID);
    })
    .then(function() {
      return retrieveConnection(FROM_USER_ID, TO_USER_ID);
    })
    .then(function(connection) {
      expect(connection.grade).to.equal(1);
      done();
    })
    .catch(done);
  });

  it("does not permit accepting a non-invitation", function(done) {
    var FROM_USER_ID = 11;
    var TO_USER_ID = 12;
    createMessage(GREETING_TYPE, FROM_USER_ID, TO_USER_ID)
    .then(function(message) {
      return actOnInviteError(ACCEPT, message.id, TO_USER_ID, 401);
    })
    .then(function() {
      done();
    })
    .catch(done);
  });

  it("permits only the recipient to accept an invitation", function(done) {
    var FROM_USER_ID = 21;
    var TO_USER_ID = 22;
    createMessage(GREETING_TYPE, FROM_USER_ID, TO_USER_ID)
    .then(function(message) {
      return actOnInviteError(ACCEPT, message.id, TO_USER_ID + 1, 401);
    })
    .then(function() {
      done();
    })
    .catch(done);
  });

  it("allows an invitation to be accepted twice", function(done) {
    var FROM_USER_ID = 31;
    var TO_USER_ID = 32;
    var firstMessage;
    createMessage(INVITE_TYPE, FROM_USER_ID, TO_USER_ID)
    .then(function(message) {
      firstMessage = message;
      return actOnInviteOk(ACCEPT, message.id, TO_USER_ID);
    })
    .then(function(message) {
      expect(message.id).to.equal(firstMessage.id);
      return actOnInviteOk(ACCEPT, message.id, TO_USER_ID);
    })
    .then(function() {
      return retrieveConnection(FROM_USER_ID, TO_USER_ID);
    })
    .then(function(connection) {
      expect(connection.grade).to.equal(1);
      done();
    })
    .catch(done);
  });

  it("allows an invitation to be rejected", function(done) {
    var FROM_USER_ID = 41;
    var TO_USER_ID = 42;
    createMessage(INVITE_TYPE, FROM_USER_ID, TO_USER_ID)
    .then(function(message) {
      return actOnInviteOk(REJECT, message.id, TO_USER_ID);
    })
    .then(function() {
      return retrieveConnection(TO_USER_ID, FROM_USER_ID);
    })
    .then(function(connection) {
      expect(connection.grade).to.equal(0);
      done();
    })
    .catch(done);
  });

  it("fails on bad action", function(done) {
    var FROM_USER_ID = 51;
    var TO_USER_ID = 52;
    createMessage(INVITE_TYPE, FROM_USER_ID, TO_USER_ID)
    .then(function(message) {
      return actOnInviteError("tumble", message.id, TO_USER_ID, 500);
    })
    .then(function() {
      done();
    })
    .catch(done);
  });
});
