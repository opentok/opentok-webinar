/* global OT, Tokinar, $ */

/**
 * Viewer scripts
 */

(function viewer_handler ($, Tokinar, OT) {
  "use strict";

  var _attrs = Tokinar.get_opentok_attrs(),
      _viewports = $(".webinar-viewer-viewports"),
      _publishers = 0,
      _subscribers = 0,
      _session;

  var handle_stream_created = function (evt) {
    _viewports.classList.add("is-live");
    if (evt.stream.videoType === "screen") {
      _session.subscribe(evt.stream, $("#presenter-screen"), {
        insertMode: "append",
        width: "100%",
        height: "100%",
        showControls: false
      }, function () {
        set_viewport({ screen: true });
      });
    } else {
      var _s = _session.subscribe(evt.stream, $("#presenter-camera"), {
        insertMode: "append",
        width: "100%",
        height: "100%",
        showControls: false,
        fitMode: "contain",
        mirror: true
      }, function () {
        set_viewport({ camera: evt.stream.hasVideo });
      });
      _s.on(handle_camera_subscriber);
    }
  };

  var handle_camera_subscriber = {
    videoEnabled: function () {
      set_viewport({ camera: true });
    },
    videoDisabled: function () {
      set_viewport({ camera: false });
    }
  };

  var handle_session_events = {
    streamDestroyed: function (evt) {
      console.log("stream destroyed screen");
      if (evt.stream.videoType === "screen") {
        set_viewport({ screen: false });
      } else {
        set_viewport({ camera: false });
      }
    },
    connectionCreated: function (evt) {
      if (evt.connection.permissions.publish) {
        _publishers++;
      } else {
        _subscribers++;
      }
    },
    connectionDestroyed: function (evt) {
      if (evt.connection.permissions.publish) {
        _publishers--;
      } else {
        _subscribers--;
      }
    }
  };

  var set_viewport = function (opts) {
    opts = opts || { camera: null, screen: null };

    if (opts.camera != undefined) {
      if (opts.camera) {
        _viewports.classList.add("has-camera");
      } else {
        _viewports.classList.remove("has-camera");
      }
    }
    if (opts.screen != undefined) {
      if (opts.screen) {
        _viewports.classList.add("has-screen");
      } else {
        _viewports.classList.remove("has-screen");
      }
    }
    if (!opts.camera && !opts.screen) {
      _viewports.classList.add("no-video");
    } else {
      _viewports.classList.remove("no-video");
    }
  };

  var setup_handlers = function (session) {
    _session = session;
    _session.on("streamCreated", handle_stream_created);
    _session.on(handle_session_events);
  };

  // Test browser capabilities and start session
  Tokinar.init_connection(_attrs, setup_handlers);

})($, Tokinar, OT);
