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
 * Create a namespace for Tokinar
 */
var Tokinar = {};

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
