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
const storage = require("./libs/storage");

// Setup OpenTok ---------------------------------
const OT = new opentok(config.opentok.api_key, config.opentok.api_secret);

// Setup storage
let db = new storage(config.app.storage_dir);

// Create app instance ---------------------------
let app = express();

// Mount middlewares -----------------------------
app.use((req, res, next) => {
  req.config = config;          // Add config
  req.OT = OT;                  // Add OpenTok SDK instance
  req.db = db;                  // Add db connection
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

// Handle errors ---------------------------------
app.use((req, res) => {
  res.status(404).render("404");
});

app.use((err, req, res, next) => {
  console.log("Error", err);
  res.status(500).render("500");
});


// Start server ----------------------------------
app.listen(config.app.port || 8080, () => {
  console.log(`Listening on port ${config.app.port || 8080}...`);
});
