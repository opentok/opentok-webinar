/**
 * Webinar handler for Tokinar
 */

let router = require("express").Router();

/**
 * Route for creating new webinar
 */
router.get("/new", (req, res) => {
  res.render("webinar-new", { title: "Create Webinar", csrf: req.csrfToken() });
});

/**
 * Route for handling webinar creation form submission
 */
router.post("/new", (req, res) => {
  // TODO: Do actual handling. Use `req.body`.
  res.send("TODO");
});


// Export the router
module.exports = router;
