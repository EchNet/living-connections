// ActionItem.js - model class ActionItem

define([ "jquery", "Asset", "util/When" ], function($, Asset, When) {

  function wrap(data) {
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        var val = data[key];
        if (val && typeof val == "object") {
          data[key] = key === "asset" ? new Asset(val) : wrap(val);
        }
      }
    }
    return data;
  }

  function defaultIcon(idParts) {
    return "/img/" + idParts[0] + "-" + idParts[1] + ".png";
  }

  function span(text) {
    var ele = $("<span>");
    text && ele.text(text);
    return ele;
  }

  function hilite(str) {
    return span(str).addClass("hilite");
  }

  function userName(data, path) {
    var name = data;
    for (var i = 0; name && i < path.length; ++i) {
      name = name[path[i]];
    }
    if (name) name = name.name;
    return name ? hilite(name) : span("another user");
  }

  function inviteNameAndEmail(invite) {
    var ele = hilite(invite.recipientName);
    if (invite.ticket && invite.ticket.email) {
      ele = span().append(ele).append(span(" <" + invite.ticket.email + ">"));
    }
    return ele;
  }

  function titleFunc(topic, aspect, data) {
    switch (topic + "-" + aspect) {
    case "ann-rec":
      return span("Announcements");
    case "ann-cre":
      return span("Make an announcement");
    case "ann-upd":
      return span("Update announcement");
    case "con-new":
    case "con-in":
    case "con-out":
      return userName(data, [ "user" ]);
    case "inv-rec":
      return span("You have an invitation");
    case "inv-cre":
      return span("Invite someone to Living Connections");
    case "inv-upd":
      return span("Update invitation");
    case "rem-cre":
      return span("Create a reminder");
    case "pro-cre":
      return span("Record your profile video");
    case "pro-upd":
      return span("Update your profile video");
    case "usr-cre":
      return span("Start by picking your user name");
    case "usr-upd":
      return span("Change your user name");
    }
    return span();
  }

  function when(obj) {
    return When.formatRelativeTime(Date.parse(obj.createdAt));
  }

  function subtitleFunc(topic, aspect, data) {
    switch (aspect) {
    case "rec":
    case "in":
    case "out":
      if (data.invite) {
        return span("from ").append(userName(data, [ "invite", "fromUser" ]));
      }
      if (data.message) {
        return span("from ").append(userName(data, [ "message", "fromUser" ])).append(span(" at " + when(data.message)));
      }
      if (data.thread && data.thread.length) {
        return span("last message from ").append(data.thread[0].fromUserId == data.user.id ? userName(data, [ "user" ]) : span("you")).append(span(" at " + when(data.thread[0])));
      }
      break;
    case "upd":
      if (data.invite) {
        return inviteNameAndEmail(data.invite);
      }
    }
    return span();
  }

  // Constructed by wrapping a JSON object.
  return function(data) {
    var idParts = data.id.split("-");
    wrap(data);

    var asset = data.user && data.user.asset;
    if (!asset) {
      asset = data.message && data.message.asset;
    }
    if (!asset) {
      if (data.thread && data.user) {
        for (var i = 0; i < data.thread.length; ++i) {
          if (data.thread[i].fromUserId == data.user.id && data.thread[i].asset) {
            asset = data.thread[i].asset;
            break;
          }
        }
      }
    }

    Object.defineProperty(this, "id", {
      get: function() {
        return data.id;
      }
    });

    Object.defineProperty(this, "topic", {
      get: function() {
        return idParts[0];
      }
    });

    Object.defineProperty(this, "aspect", {
      get: function() {
        return data.aspect || idParts[1];
      }
    });

    Object.defineProperty(this, "iconUrl", {
      get: function() {
        return (asset && asset.iconUrl) || defaultIcon(idParts);
      }
    });

    Object.defineProperty(this, "title", {
      get: function() {
        return titleFunc(idParts[0], this.aspect, data);
      }
    });

    Object.defineProperty(this, "subtitle", {
      get: function() {
        return subtitleFunc(idParts[0], this.aspect, data);
      }
    });

    Object.defineProperty(this, "raw", {    // TEMPORARY
      get: function() {
        return data;
      }
    });
  }
});
