/**
 * Tokinar main server script
 *
 * This script starts the Tokinar application server by mounting all
 * the necessary routes, loading configuration and creating a handler
 * to OpenTok's server side SDK.
 */

// Load dependencies -----------------------------
const express = require("express");
const opentok = require("opentok");
const config = require("./config");

// Setup OpenTok ---------------------------------
const OT = new opentok(config.opentok.api_key, config.opentok.api_secret);

// Create app instance ---------------------------
let app = express();

// Mount middlewares -----------------------------
app.use((req, res, next) => {
  req.config = config;
  req.OT = OT;
  res.setHeader("X-Powered-By", "Tokinar");
  next();
});

// Set view engine -------------------------------
app.set("view engine", "ejs");

// Mount routes ----------------------------------
app.get("/", (req, res) => {
  res.render("homepage");
});

// Mount scheduling routes
app.use("/schedule", require("./app/schedule"));

// Mount webinar routes
app.use("/webinar", require("./app/webinar"));

// Mount API routes
app.use("/api", require("./app/api"));

// Mount the `./assets` dir as static.
app.use("/assets", express.static("./assets"));


// Start server ----------------------------------
app.listen(config.app.port || 8080, () => {
  console.log(`Listening on port ${config.app.port || 8080}...`);
});
