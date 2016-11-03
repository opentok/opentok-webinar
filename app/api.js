/**
 * JSON API handler for Tokinar
 *
 * This module handles API routes, performs necessary actions and
 * responds as JSON.
 */

let router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ foo: "bar" });
});


// Export the router
module.exports = router;
