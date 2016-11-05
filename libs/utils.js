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


/**
 * Merge given config with env vars.
 *
 * Env vars are supposed to represent config object nesting as
 * double-underscore-delimited. e.g., `{app:{port:xx}}` will be
 * represented as `app__port` in the env var, and
 * `{opentok:{api_key:xx}}` will be represented as `opentok__api_key`.
 *
 * @param {Object} config An existing config loaded from config file.
 * @returns {Object} The provided object merged with env vars.
 */
let merge_env = config => {
  let known_vars = ["app__port",
                    "app__storage_dir",
                    "opentok__api_key",
                    "opentok__api_secret"];

  for (let k of known_vars) {
    if (process.env[k]) {
      let sp = k.split("__");
      config[sp[0]][sp[1]] = process.env[k];
    }
  }
  return config;
};

// Export them
module.exports = {
  as_slug: as_slug,
  merge_env: merge_env
};
