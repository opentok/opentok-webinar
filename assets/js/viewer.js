/* global OT, Tokinar, $ */

/**
 * Viewer scripts
 */

(function viewer_handler ($, Tokinar, OT) {
  "use strict";

  var _attrs = Tokinar.get_opentok_attrs(),
      _feeds = { screen: false, camera: false },
      _session;

  var handle_stream_created = function (evt) {
    if (evt.stream.videoType === "screen") {
      _session.subscribe(evt.stream, $("#presenter-screen"), {
        insertMode: "append",
        width: 640,
        height: 480
      });
    } else {
      _session.subscribe(evt.stream, $("#presenter-camera"), {
        insertMode: "append",
        width: 120,
        height: 90
      });
    }
  };

  var setup_handlers = function (session) {
    _session = session;
    _session.on("streamCreated", handle_stream_created);
  };

  // Test browser capabilities and start session
  Tokinar.init_connection(_attrs, setup_handlers);

})($, Tokinar, OT);
