/* global OT, Tokinar, $ */

/**
 * Viewer scripts
 */

(function viewer_handler ($, Tokinar, OT) {
  "use strict";

  var _attrs = Tokinar.get_opentok_attrs(),
      _session;

  var handle_stream_created = function (evt) {
    _session.subscribe(evt.stream, $("#presenter"));
  };

  var setup_handlers = function (session) {
    _session = session;
    _session.on("streamCreated", handle_stream_created);
  };

  // Test browser capabilities and start session
  Tokinar.init_connection(_attrs, setup_handlers);

})($, Tokinar, OT);
