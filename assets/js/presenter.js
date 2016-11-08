/* global OT, Tokinar, $ */

/**
 * Presenter scripts
 */

(function presenter_handler ($, Tokinar, OT) {
  "use strict";

  var _attrs = Tokinar.get_opentok_attrs(),
      _msg = Tokinar.create_message_handler($("#presenter-msg")),
      _screenshare_enabled = false,
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
      // $("#pause-btn").removeAttribute("disabled");
      $("#end-btn").removeAttribute("disabled");
      evt.target.setAttribute("disabled", "disabled");
      $("#presenter-screen").classList.remove("inactive");
      _msg("You are live.");
      Tokinar.set_broadcast_status("onair");
    };
  };

  var handle_start = function (evt) {
    var opts = {
      insertMode: "append",
      publishAudio: true
    };
    var target = "#presenter-camera";

    // TODO: Remove this hack and make it user input driven
    if (_screenshare_enabled) {
      opts.videoSource = "screen";
      target = "#presenter-screen";
    }

    Tokinar.set_broadcast_status("connecting");
    _msg("Getting user media...");

    _publisher = OT.initPublisher($(target), opts, function (err) {
      if (err) {
        _msg("Error getting access to user media.");
        Tokinar.set_broadcast_status("error");
        return;
      }

      // TODO: Test audio/video before publishing
      _session.publish(_publisher, handle_publisher(evt));
    });
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
    // $("#pause-btn").setAttribute("disabled", "disabled");
    $("#end-btn").setAttribute("disabled", "disabled");
    $("#start-btn").setAttribute("disabled", "disabled");
  };

  var install_chrome_extension = function () {
    var ext_url = "https://chrome.google.com/webstore/detail/ibjimaenheofjdnpjplikdaccljdfmaf";
    chrome && chrome.webstore && chrome.webstore.install(ext_url, function() {
      $("#installers").className = "hidden";
      $("#chrome-install").setAttribute("disabled", "disabled");
    }, function (err) {
      $("#chrome-install").setAttribute("disabled", "disabled");
      _msg("Unable to install screensharing extension.");
      console.log(err);
    });
  };

  var check_screenshare_support = function () {
    OT.checkScreenSharingCapability( function(res) {
      if (!res.supported || res.extensionRegistered === false) {
        alert("Screensharing is not supported");
      } else if (res.extensionRequired === "chrome" && res.extensionInstalled === false) {
        $("#installers").classList.remove("hidden");
      } else {
        _screenshare_enabled = true;
      }
    });
  };

  var setup_handlers = function (session) {
    _session = session;
    _session.on("sessionDisconnected", handle_disconnect);

    // Register screenshare
    OT.registerScreenSharingExtension('chrome', 'ibjimaenheofjdnpjplikdaccljdfmaf', 2);

    $("#start-btn").removeAttribute("disabled");
    $("#start-btn").addEventListener("click", handle_start);
    // $("#pause-btn").addEventListener("click", handle_pause);
    $("#end-btn").addEventListener("click", handle_end);

    // Installers
    $("#chrome-install").addEventListener("click", install_chrome_extension);

    // Check screenshare support
    check_screenshare_support();

    _msg("Ready to broadcast. Click \"Start broadcast\" to begin.");
  };

  // Test browser capabilities and start session
  _msg("Setting up...");
  Tokinar.init_connection(_attrs, setup_handlers);

})($, Tokinar, OT);
