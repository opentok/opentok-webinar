/* global OT, Tokinar, $ */

/**
 * Presenter scripts
 */

(function presenter_handler ($, Tokinar, OT) {
  "use strict";

  var _attrs = Tokinar.get_opentok_attrs(),
      _session,
      _publisher;

  var handle_start = function (evt) {
    _publisher = OT.initPublisher($("#presenter-view"), {
      insertMode: "replace"
    });
    // TODO: Test audio/video before publishing
    _session.publish(_publisher, function (err) {
      if (err) {
        console.log(err);
        $("#presenter-view").innerHTML = "<p>Could not publish your feed.</p>";
        return;
      }
      $("#pause-btn").removeAttribute("disabled");
      $("#end-btn").removeAttribute("disabled");
      evt.target.setAttribute("disabled", "disabled");
      $("#presenter-view").classList.remove("inactive");
    });
  };

  var handle_pause = function () {
    // TODO: Handle pausing of broadcast
  };

  var handle_end = function () {
    // TODO: Handle ending broadcast
  };

  var setup_handlers = function (session) {
    _session = session;
    $("#start-btn").addEventListener("click", handle_start);
    $("#pause-btn").addEventListener("click", handle_pause);
    $("#end-btn").addEventListener("click", handle_end);
  };

  // Test browser capabilities and start session
  Tokinar.init_connection(_attrs, setup_handlers);

})($, Tokinar, OT);
