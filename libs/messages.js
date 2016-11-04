/**
 * Messages used in Tokinar
 *
 * Maps codes to full messages
 */

/**
 * Generate messages from query
 *
 * @param {string} t Type of message. Values: "error" or "info".
 * @param {string} q Query value
 *
 * @returns {string|null} Message string if query was resolved. Else
 * `null`.
 */
let from_query = (t, q) => {
  if (!(!!q)) {
    return null;
  }
  switch (t) {
  case "error":
    return error[q] || null;
    break;
  case "info":
    return info[q] || null;;
    break;
  default:
    return null;
  }
};

// Error messages
let error = {
  exists: "Webinar already exists by that name. Please choose a different name.",
  invalid_input: "Invalid input."
};

// Info messages
let info = {
  created: "Webinar created. Feel free to play around"
};

module.exports = {
  error: error,
  info: info,
  from_query: from_query
};
