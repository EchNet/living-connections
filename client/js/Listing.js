// Listing.js - action item list component.

define([ "jquery", "ui/index", "services" ], function($, ui, Services) {

  return ui.Component.defineClass(function(c) {

    function openActionItem(self, actionItem) {
      if (self.isOpen) {
        self.invokePlugin("openActionItem", actionItem);
      }
    }

    function startLaunchTimeout(self, actionItem) {
      self.launchTimeout = setTimeout(function() {
        openActionItem(self, actionItem);
      }, 3000);
    }

    function cancelLaunchTimeout(self) {
      clearTimeout(self.launchTimeout);
    }

    function renderItem(self, actionItem) {
      return $("<div>")
        .addClass("item")
        .append($("<img>")
          .addClass("bigIcon")
          .attr("src", actionItem.iconUrl))
        .append($("<div>")
          .addClass("content")
          .append($("<div>")
            .addClass("title")
            .append(actionItem.title))
          .append($("<div>")
            .addClass("subtitle")
            .append(actionItem.subtitle))
        )
        .click(function() {
          openActionItem(self, actionItem);
        })
    }

    function render(self, actionItems) {
      var container = self.container.empty()      // TODO: render incrememtally.
      var lastBatch = self.lastBatch;
      var newBatch = {};
      cancelLaunchTimeout(self);
      if (actionItems) {
        for (var i = 0; i < actionItems.length; ++i) {
          var actionItem = actionItems[i];
          var itemView = renderItem(self, actionItem).appendTo(container);
          /***
          if (lastBatch && !(actionItem.id in lastBatch)) {
            itemView.addClass("new");
            if (self.chime) {
              self.chime.play();
            }
          }
          ***/
          newBatch[actionItem.id] = actionItem;
        }
        if (actionItems.length == 1) {
          startLaunchTimeout(self, actionItems[0]);
        }
      }
      self.lastBatch = newBatch;
    }

    c.defineInitializer(function() {
      var self = this;
      self.container.addClass("listing");
      new ui.Audio().load("audio/chime.wav").then(function(chime) {
        self.container.append(chime.container);
        self.chime = chime;
      });
      render(self, Services.sessionManager.actionItems.value);
    });

    c.extendPrototype({
      open: function() {
        var self = this;
        if (!self.isOpen) {
          self.isOpen = true;
          self.closeHandle = Services.sessionManager.addActionListener(function(actionItems) {
            render(self, actionItems);
          });
        }
        return this;
      },
      close: function() {
        var self = this;
        cancelLaunchTimeout(self);
        self.isOpen = false;
        if (self.closeHandle) {
          self.closeHandle.undo();
          self.closeHandle = null;
        }
        return self;
      }
    });
  });
});
