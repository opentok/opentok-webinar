/**
 * Schedule handler for Tokinar
 *
 * This script handles routes for scheduling a webinar.
 */

let router = require("express").Router();

router.get("/", (req, res) => {
  res.render("schedule", { title: "Schedule a Webinar" });
});


// Export the router
module.exports = router;
