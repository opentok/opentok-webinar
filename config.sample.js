/**
 * Tokinar config file
 *
 * Copy this file to `config.js` in the same directory and edit that
 * file instead.
 */

module.exports = {

  /**
   * Application settings
   */
  app: {

    /**
     * Base URL for the application, including protocol, hostname and
     * port
     */
    base_url: "http://localhost:8080",

    /**
     * Port to host the application on. Default: 8080.
     */
    port: 8080,

    /**
     * Directory for storage. Default: "./storage"
     */
    storage_dir: "./storage",

    /**
     * Google Analytics Tracking ID as a string. Default: null.
     */
    ga: null

  },

  // ----------------------------------------------

  /**
   * TokBox OpenTok settings
   */
  opentok: {

    /**
     * API Key obtained from TokBox
     */
    api_key: "xxxx",

    /**
     * API Secret obtained from TokBox
     */
    api_secret: "xxxx"
  },

  // ---------------------------------------------

  /**
   * SSL settings
   */
  ssl: {

    /**
     * SSL enabled? Make this `true` to serve over HTTPS.
     */
    enabled: false,

    /**
     * Path to SSL key. Relative to project root or absolute path.
     */
    key: "key.pem",

    /**
     * Path to SSL certificate. Relative to project root or absolute
     * path.
     */
    cert: "cert.pem",

    /**
     * SSL passphrase, if any
     */
    passphrase: ""

  }
};
