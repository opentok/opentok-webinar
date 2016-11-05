/**
 * Utility methods for Tokinar
 */

const path = require("path");

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
  let known_vars = ["app__base_url",
                    "app__port",
                    "app__storage_dir",
                    "opentok__api_key",
                    "opentok__api_secret"];

  for (let k of known_vars) {
    if (process.env[k]) {
      let sp = k.split("__");
      config[sp[0]][sp[1]] = process.env[k];
    }
  }

  // Override specific known envs
  process.env.PORT && (config.app.port = process.env.PORT);

  return config;
};


/**
 * Default config for Tokinar
 *
 * @returns {Object} The default config object
 */
let default_config = () => {
  return {
    app: {
      base_url: "http://localhost:8080",
      port: 8080,
      storage_dir: "./storage"
    },
    opentok: {
      api_key: "",
      api_secret: ""
    }
  };
};


/**
 * Loads config in given path. If not found, returns default config.
 *
 * @param {string} dir Directory to load config from
 * @returns {Object} A config object
 */
let load_config = dir => {
  let config;
  try {
    config = require(path.join(dir, "config"));
  } catch (_) {
    config = default_config();
  }
  return merge_env(config);
};

// Export them
module.exports = {
  as_slug: as_slug,
  load_config: load_config
};
