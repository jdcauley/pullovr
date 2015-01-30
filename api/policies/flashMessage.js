"use strict";

module.exports = function flashMessage(request, response, next) {
  sails.log.verbose(" POLICY - api/policies/flashMessage.js");

  request.flash.message = function(message, type, options) {
    type = type || "success";
    options = options || {};

    // Store message to session
    request.session.messages.push({
      "message": message,
      "type": type,
      "options": options
    });
  };

  // Get messages from session or initialize message session
  var messages = request.session.messages || (request.session.messages = []);

  if (request.cookies && request.cookies.message) {
    // Store message to session
    request.session.messages.push(request.cookies.message);

    // Remove temp cookie
    response.cookie("message", "", { expires: new Date(Date.now() - 3600) });
  }

  // Store current messages to res.locals so they can be accessed from views
  response.locals.flashMessages = (!messages.length) ? false : messages;

  // Clear existing messages from session
  request.session.messages = [];

  next();
};
