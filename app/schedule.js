/**
 * Schedule handler for Tokinar
 *
 * This script handles routes for scheduling a webinar.
 */

let router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Schedule");
});


// Export the router
module.exports = router;
