/**
 * Schedule handler for Tokinar
 *
 * This script handles routes for scheduling a webinar.
 */

let router = require("express").Router();

router.get("/", (req, res) => {
  req.template_data.title = "Schedule a Webinar";
  res.render("schedule", req.template_data);
});


// Export the router
module.exports = router;
