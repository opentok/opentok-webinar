/**
 * Utility methods for Tokinar
 */

const path = require("path"),
      crypto = require("crypto");


/**
 * Generate slug
 *
 * @returns {String} A 7-character slug, hyphenated in between.
 */
let create_slug = () => {
  var id = crypto.randomBytes(3).toString("hex");
  return [id.slice(0, 3), id.slice(3)].join("-");
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
                    "app__ga",
                    "opentok__api_key",
                    "opentok__api_secret",
                    "ssl__enabled",
                    "ssl__key",
                    "ssl__cert",
                    "ssl__passphrase"];

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
      storage_dir: "storage",
      ga: null
    },
    opentok: {
      api_key: "",
      api_secret: ""
    },
    ssl: {
      enabled: false,
      key: "key.pem",
      cert: "cert.pem",
      passphrase: ""
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
  create_slug: create_slug,
  load_config: load_config
};
