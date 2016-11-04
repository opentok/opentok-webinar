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
const bodyparser = require("body-parser");
const cookies = require("cookie-parser");
const csrf = require("csurf");
const config = require("./config");
const storage = require("./libs/storage");
const utils = require("./libs/utils");
const msgs = require("./libs/messages");

// Setup OpenTok ---------------------------------
const OT = new opentok(config.opentok.api_key, config.opentok.api_secret);

// Setup storage
let db = new storage(config.app.storage_dir);

// Create app instance ---------------------------
let app = express();

// Set view engine -------------------------------
app.set("view engine", "ejs");

// Enable body-parser ----------------------------
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// Enable cookie-parser --------------------------
app.use(cookies());

// Enable CSRF
app.use(csrf({ cookie: true }));

// Security measures -----------------------------
app.disable("x-powered-by");

// Mount middlewares -----------------------------
app.use((req, res, next) => {
  req.config = config;          // Add config
  req.OT = OT;                  // Add OpenTok SDK instance
  req.db = db;                  // Add db connection
  req.utils = utils;            // Add utility functions

  req.template_data = {         // Set data for templates
    title: "Tokinar",           // Default page title
    csrf: null,                 // Use req.csrfToken()
    error: msgs.from_query("error", req.query.e), // Error message
    info: msgs.from_query("info", req.query.i),   // Info message
    scripts: ["tokinar"],    // List of scripts to load
    styles: ["tokinar"]     // List of styles to load
  };

  next();
});

// Mount routes ----------------------------------
app.get("/", (req, res) => {
  res.render("homepage", req.template_data);
});

// Mount scheduling routes
app.use("/schedule", require("./routes/schedule"));

// Mount webinar routes
app.use("/webinar", require("./routes/webinar"));

// Mount the `./assets` dir as static.
app.use("/assets", express.static("./assets"));

// Handle errors ---------------------------------
app.use((req, res) => {
  req.template_data.title = "Gone! Not found!";
  res.status(404).render("404", req.template_data);
});

app.use((err, req, res, next) => {
  console.log("Error", err);
  req.template_data.title = "OOPS!";
  res.status(500).render("500", req.template_data);
});


// Start server ----------------------------------
app.listen(config.app.port || 8080, () => {
  console.log(`Listening on port ${config.app.port || 8080}...`);
});
