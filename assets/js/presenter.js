/* global OT, Tokinar, $ */

/**
 * Presenter scripts
 */

(function presenter_handler ($, Tokinar, OT) {
  "use strict";

  var _attrs = Tokinar.get_opentok_attrs(),
      _msg = Tokinar.create_message_handler($("#presenter-msg")),
      _live = false,
      _starttime,
      _timer,
      _session,
      _publisher_camera,
      _publisher_screen;


  var handle_publish_success = function () {
    _starttime = new Date();
    _timer = Tokinar.set_timer($("#duration span"), _starttime);
    // $("#pause-btn").removeAttribute("disabled");
    $("#end-btn").removeAttribute("disabled");
    $("#start-btn").setAttribute("disabled", "disabled");

    _live = true;

    _msg("You are live.");
    Tokinar.set_broadcast_status("onair");
  };


  var handle_publish_error = function (err) {
    console.log(err);
    _msg("Could not publish your feed.");
    Tokinar.set_broadcast_status("error");
  };


  var handle_start = function (evt) {
    Tokinar.set_broadcast_status("connecting");
    // Publish A/V stream first
    _session.publish(_publisher_camera, function (err) {
      if (err) {
        handle_publish_error(err);
        return;
      }

      if (!!_publisher_screen) {
        // Publish screen share once A/V stream is published.
        _session.publish(_publisher_screen, function (err) {
          if (err) {
            handle_publish_error(err);
            return;
          }
          // Everything published
          handle_publish_success();
        });
      } else {
        handle_publish_success();
      }
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
      console.log(err);
      _msg("Please install the Tokinar Screen Sharing extension and refresh the page.");
      Tokinar.set_dialog($("#chrome-installer-message"));
      $("#chrome-install").setAttribute("disabled", "disabled");
    });
  };


  var check_screenshare_support = function (callback) {
    OT.checkScreenSharingCapability(function(res) {
      var screenshare_enabled = false;
      if (!res.supported || res.extensionRegistered === false) {
        Tokinar.set_dialog("Screensharing is not supported");
      } else if (res.extensionRequired === "chrome" && res.extensionInstalled === false) {
        // Chrome installer
        $("#chrome-install").addEventListener("click", install_chrome_extension, false);
        $("#installers").classList.remove("hidden");
      } else {
        screenshare_enabled = true;
      }
      // Trigger callback
      callback(screenshare_enabled, res);
    });
  };


  var create_publisher_camera = function (el) {
    var opts = {
      insertMode: "replace",
      publishAudio: $("#camera-control-mute-audio") ? !$("#camera-control-mute-audio").checked : true,
      publishVideo: $("#camera-control-share-video") ? $("#camera-control-share-video").checked : false
    };

    _msg("Getting camera and microphone access...");

    _publisher_camera = OT.initPublisher($("#presenter-camera"), opts, function (err) {
      if (err) {
        _msg("Error getting access to user media.");
        Tokinar.set_broadcast_status("error");
        return;
      }
      el.target.setAttribute("disabled", "disabled");
      Tokinar.set_broadcast_status("ready");
      _msg("Click \"Start Broadcast\" button when you are ready to go live.");
      $("#start-btn").removeAttribute("disabled");
    });
  };


  var create_publisher_screenshare = function (el) {
    var opts = {
      insertMode: "replace",
      publishAudio: false,
      videoSource: "screen"
    };

    _msg("Setting up screenshare...");

    _publisher_screen = OT.initPublisher($("#presenter-screen"), opts, function (err) {
      if (err) {
        _msg("Error getting access to screen share.");
        // Tokinar.set_broadcast_status("error");
        return;
      }

      el.target.setAttribute("disabled", "disabled");
      //$("#screen-share-stop").removeAttribute("disabled");
      _msg("Screenshare is set up.");

      // Push screenshare publisher if session is live
      if (_live) {
        _session.publish(_publisher_screen, function (err) {
          if (err) {
            console.log(err);
            _msg("Could not publish screenshare");
            return;
          }
          _msg("Screen published");
        });
      }
    });
  };


  var handle_mute_mic = function (el) {
    _publisher_camera && _publisher_camera.publishAudio && _publisher_camera.publishAudio(!el.target.checked);
  };


  var handle_camera_toggle = function (el) {
    _publisher_camera && _publisher_camera.publishAudio && _publisher_camera.publishVideo(el.target.checked);
  };


  var bind_broadcast_controls = function () {
    $("#start-btn").addEventListener("click", handle_start);
    // $("#pause-btn").addEventListener("click", handle_pause);
    $("#end-btn").addEventListener("click", handle_end);
  };


  var bind_viewport_controls = function () {
    var _handler = function (el) {
      if (el.id && el.id.match(/-stop$/) !== null) {
        return;
      }
      el.removeAttribute("disabled");
    };
    document.querySelectorAll(".viewport-controls [disabled=disabled]").forEach(_handler);
    $("#camera-share-start").addEventListener("click", create_publisher_camera, false);
    $("#camera-control-share-video").addEventListener("change", handle_camera_toggle, false);
    $("#camera-control-mute-audio").addEventListener("change", handle_mute_mic, false);
    $("#screen-share-start").addEventListener("click", create_publisher_screenshare, false);
  };


  var setup_handlers = function (session) {
    _session = session;
    _session.on("sessionDisconnected", handle_disconnect);

    // Register screenshare
    OT.registerScreenSharingExtension("chrome", "ibjimaenheofjdnpjplikdaccljdfmaf", 2);

    // Check screenshare support and get user media
    check_screenshare_support(function () {
      bind_viewport_controls();
      bind_broadcast_controls();
      _msg("Select and adjust your media sources.");
    });
  };

  // Test browser capabilities and start session
  _msg("Setting up...");
  Tokinar.init_connection(_attrs, setup_handlers);

})($, Tokinar, OT);
