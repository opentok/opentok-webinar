/* global OT, Tokinar, $ */

/**
 * Presenter scripts
 */

(function presenter_handler ($, Tokinar, OT) {
  "use strict";

  var _attrs = Tokinar.get_opentok_attrs(),
      _msg = Tokinar.create_message_handler($("#presenter-msg")),
      _starttime,
      _timer,
      _session,
      _publisher;

  var handle_publisher = function (evt) {
    return function handle_publisher_inner (err) {
      if (err) {
        console.log(err);
        _msg("Could not publish your feed.");
        Tokinar.set_broadcast_status("error");
        return;
      }
      _starttime = new Date();
      _timer = Tokinar.set_timer($("#duration span"), _starttime);
      $("#pause-btn").removeAttribute("disabled");
      $("#end-btn").removeAttribute("disabled");
      evt.target.setAttribute("disabled", "disabled");
      $("#presenter-view").classList.remove("inactive");
      _msg("You are live.");
      Tokinar.set_broadcast_status("onair");
    };
  };

  var handle_start = function (evt) {
    Tokinar.set_broadcast_status("connecting");
    _msg("Getting user media...");
    _publisher = OT.initPublisher($("#presenter-view"), {
      insertMode: "append"
    });
    // TODO: Test audio/video before publishing
    _session.publish(_publisher, handle_publisher(evt));
  };

  var handle_pause = function () {
    // TODO: Handle pausing of broadcast
  };

  var handle_end = function () {
    if(confirm("Are you sure you want to end the broadcast?")) {
      _session.disconnect();
    }
  };

  var handle_disconnect = function (evt) {
    clearInterval(_timer);
    Tokinar.set_broadcast_status("offline");
    if (evt.reason === "forceDisconnected") {
      _msg("You have been disconnected by a moderator.");
    } else if (evt.reason === "networkDisconnected") {
      _msg("You have lost connection due to network issues.");
    } else {
      _msg("You have stopped broadcasting.");
    }
    $("#pause-btn").setAttribute("disabled", "disabled");
    $("#end-btn").setAttribute("disabled", "disabled");
    $("#start-btn").setAttribute("disabled", "disabled");
  };

  var setup_handlers = function (session) {
    _session = session;
    _session.on("sessionDisconnected", handle_disconnect);
    $("#start-btn").removeAttribute("disabled");
    $("#start-btn").addEventListener("click", handle_start);
    $("#pause-btn").addEventListener("click", handle_pause);
    $("#end-btn").addEventListener("click", handle_end);
    _msg("Ready to broadcast. Click \"Start broadcast\" to begin.");
  };

  // Test browser capabilities and start session
  _msg("Setting up...");
  Tokinar.init_connection(_attrs, setup_handlers);

})($, Tokinar, OT);
