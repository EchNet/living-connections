// vid.js

define([ "jquery", "lib/webrtc-adapter" ], function($) {

  //
  // Function IsCapable
  //
  function IsCapable() {
    return !!navigator.mediaDevices;
  }

  //
  // Class LocalVideoController
  //
  function LocalVideoController() {
  }

  function forEachTrack(stream, func) {
    if (stream) {
      var tracks = stream.getTracks();
      for (var i = 0; i < tracks.length; ++i) {
        func(tracks[i]);
      }
    }
  }

  function dumpTracks(stream) {
    forEachTrack(stream, function(track) {
      console.log("Track " + track.id + ": " + track.kind + ", " + track.label);
    });
  }

  function openLocalVideo() {
    var self = this;
    var deferred = $.Deferred();
    if (self.stream) {
      defered.resolve(self);
    }
    else if (!IsCapable()) {
      defered.reject("browser not video-capable");
    }
    else {
      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
      })
      .then(function(stream) {
        console.log("localVideo.gotStream");
        self.stream = stream;
        dumpTracks(stream);
        deferred.resolve(self);
      })
      .catch(function(error) {
        self.openError = error;
        deferred.reject(error);
      });
    }
  }

  function closeLocalVideo() {
    var self = this;
    forEachTrack(function(track) {
      track.stop();
    });
    self.stream = null;
  }

  LocalVideoController.prototype = {
    open: openLocalVideo,
    close: closeLocalVideo
  }

  //
  // The module.
  //
  return {
    IsCapable: IsCapable,
    LocalVideoController: LocalVideoController
  }
});
