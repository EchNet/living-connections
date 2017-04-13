// ActivityStarter.js - logic for selecting, creating, and initializing an activity.

define([ "ConnectionViewer", "AnnouncementEditor", "CreateInviteEditor", "ProfileVideoEditor",
  "UpdateInviteEditor", "UserNameEditor", "InviteViewer", "CreateReminderEditor" ],
function( ConnectionViewer,  AnnouncementEditor,   CreateInviteEditor, ProfileVideoEditor,
  UpdateInviteEditor,   UserNameEditor,   InviteViewer, CreateReminderEditor) {

  function classForActionItem(actionItem) {
    if (actionItem.topic == "inv") {
      switch (actionItem.aspect) {
      case "cre":
        return CreateInviteEditor;
      case "upd":
        return UpdateInviteEditor;
      case "rec":
        return InviteViewer;
      }
    }
    if (actionItem.topic == "con") {
      return ConnectionViewer;
    }
    if (actionItem.topic == "rem") {
      switch (actionItem.aspect) {
      case "cre":
        return CreateReminderEditor;
      }
    }
    if (actionItem.aspect == "rec") {
      return ConnectionViewer;
    }
    switch (actionItem.topic) {
    case "ann":
      return AnnouncementEditor;
    case "pro":
      return ProfileVideoEditor;
    case "usr":
      return UserNameEditor;
    }
  }

  return {
    startActivityFor: function(actionItem) {
      var ActivityClass = classForActionItem(actionItem);
      return new ActivityClass("<div>", { actionItem: actionItem })
    }
  }
});
