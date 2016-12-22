/* util/exec.js */

module.exports = (function() {

  const Promise = require("promise");
  const extend = require("extend");
  const nodemailer = require("nodemailer");
  const mailgun = require("nodemailer-mailgun-transport");

  const emailFrom = "admin@livingcx.com";

  const auth = {
    auth: {
      api_key: "key-1a42bcc21a15252b0de1fc4ab0540863",
      domain: "sandboxd9cba0aefb144d048bd0592ac8ea3585.mailgun.org"
    }
  }

  function send(options) {

    return new Promise(function(resolve, reject) {

      console.log("email", options.to, options.subject);

      nodemailer.createTransport(mailgun(auth)).sendMail(extend({
        from: emailFrom,
      }, options), function(error, info) {
        if (error) {
          reject(error);
        }
        else {
          resolve(info);
        }
      });
    });
  }

  return {
    send: send
  }
})();
