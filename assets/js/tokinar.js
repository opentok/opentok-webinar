/* global OT */
"use strict";

/**
 * Simple selector interface with caching
 */
var _selector = function () {
  var _cache = {};

  return function _selector_inner (qs) {
    if (_cache[qs]) {
      return _cache[qs];
    }
    _cache[qs] = document.querySelector(qs);
    return _cache[qs];
  };
};

/**
 * Shorthand for selector
 */
var $ = _selector();

/**
 * Set a timer to server side messages
 */
(function _clear_msgs () {
  var msgs = document.querySelectorAll(".msg");
  if (msgs.length > 0) {
    setTimeout(function () {
      msgs.forEach(function (el) {
        el.parentNode.removeChild(el);
      });
    }, 7500);
  }
})();

/**
 * Create a namespace for Tokinar
 */
var Tokinar = {
  _dialog_timer: null
};

/**
 * Get opentok credentials from document
 *
 * @returns {Object|null} Returns an object or null if no data is found
 */
Tokinar.get_opentok_attrs = function () {
  var webinar = $("#webinar");
  if (webinar === null || !webinar.dataset["opentok"]) {
    return null;
  }
  try {
    return JSON.parse(webinar.dataset.opentok);
  } catch (e) {
    console.log(e);
    return null;
  }
};

/**
 * Initialize an Opentok connection and execute callback
 */
Tokinar.init_connection = function (_attrs, cb) {
  var _session;
  // Test browser capabilities and start session
  if (OT.checkSystemRequirements() === 1) {
    _session = OT.initSession(_attrs.api_key, _attrs.session_id);
    _session.connect(_attrs.token, function (err) {
      if (err) {
        console.log(err);
        // TODO: Show UI message
        return;
      }
      cb(_session);
    });
  } else {
    // Meh, your browser doesn't love WebRTC.
    // TODO: Show better UI message
    alert("Your browser does not support WebRTC.");
  }

};

/**
 * Sets broadcast status on the `#broadcast-status` element.
 *
 * @param {string} status A valid status. One of: "onair", "offline",
 * "paused","ended","error".
 */
Tokinar.set_broadcast_status = function (status) {
  var el = $("#broadcast-status");
  var status_list = {
    onair: "On Air",
    connecting: "Connecting",
    offline: "Offline",
    paused: "Paused",
    ended: "Ended",
    error: "Error",
    ready: "Ready"
  };
  if (el !== null && !!status_list[status]) {
    el.className = status;
    el.textContent = status_list[status];
  }
};

/**
 * Create a message handler that writes message to specific DOM
 * element.
 *
 * @param {Object} el The DOM element to print messages in
 *
 * @returns {Function} A closure that prints messages to specified
 * element.
 */
Tokinar.create_message_handler = function (el) {
  var _timeout = null,
      _last_message = null;

  return function message_handler_inner (data, escape) {
    if (_timeout !== null) {
      clearTimeout(_timeout);
    }
    _last_message = data;
    escape = escape | true;
    if (escape) {
      el.textContent = data;
    } else {
      el.innerHTML = data;
    }
    _timeout = setTimeout(function () {
      el.innerHTML = "";
    }, 7500);
  };
};

/**
 * Update a timer with time since a given date
 *
 * @param {Object} el The element to write the time to
 * @param {Object} starttime The start time created with `new Date()`
 *
 * @returns {Timeout} The Timeout function that can be used to clear the interval set here.
 */
Tokinar.set_timer = function (el, starttime) {
  return setInterval(function () {
    var t = Date.parse(new Date()) - Date.parse(starttime);
    el.textContent = [Math.floor( t/(1000*60*60*24) ),
                      Math.floor( (t/(1000*60*60)) % 24 ),
                      Math.floor( (t/1000/60) % 60 ),
                      Math.floor( (t/1000) % 60)].join(":");
  }, 2000);
};

/**
 * Set dialog box. Display modal.
 *
 * @param {Element|String} input A DOM element whose innerHTML is used
 * to fill the content of the dialog. Or a string.
 * @param {String=} title An optional string to use as dialog
 * title. If first param is a DOM element, then its "data-title"
 * attribute can be used instead.
 * @param {Number=} timer A number in miliseconds to automatically
 * unset the modal after the specified time.
 */
Tokinar.set_dialog = function (input, title, timer) {
  if (!!Tokinar._dialog_timer) {
    clearTimeout(Tokinar._dialog_timer);
  }
  Tokinar.unset_modal();
  if (typeof input === "string") {
    $("#dialog-content").innerHTML = input;
  } else if (input instanceof Element) {
    $("#dialog-content").innerHTML = input.innerHTML;
    title = title || input.dataset["title"] || "";
  }
  $("#dialog-title").innerHTML = title || "";
  $("#dialog").classList.remove("off");
  $("body").classList.add("has-dialog");
  if (!!timer) {
    Tokinar._dialog_timer = setTimeout(function () {
      Tokinar.unset_modal();
    }, timer);
  }
};

/**
 * Unset dialog box. Hide modal.
 */
Tokinar.unset_modal = function () {
  $("#dialog").className = "off";
  $("#dialog-content").innerHTML = $("#dialog-title").innerHTML = "";
  $("body").classList.remove("has-dialog");
};

/**
 * Set binding for dialog modal
 */
(function set_dialog_binding () {
  var c = $("#dialog-close");
  if (c !== null) {
    c.addEventListener("click", function () {
      Tokinar.unset_modal();
    }, false);
  }
})();


/**
 * Setup clipboard target
 */
(function setup_clipboard_targets () {
  if (typeof Clipboard === "function") {
    var cboard = new Clipboard(".copy");
    cboard.on("success", function (e) {
      console.log(e);
      console.log(e.action, e.trigger);
      e.trigger.textContent = "Copied!";
    });
  }
})();
