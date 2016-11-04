/**
 * Utility methods for Tokinar
 */

/**
 * Generate URL "slug" version of a given string.
 *
 * @param {string} s An input string.
 *
 * @returns {string} The slug as a string.
 */
let as_slug = s => {
  return s.trim().toLowerCase().replace(/\W/g, "-").replace(/\-+$/, "");
};


// Export them
module.exports = {
  as_slug: as_slug
};
