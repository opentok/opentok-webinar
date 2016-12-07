/**
 * Homepage handler for Tokinar
 */

let router = require("express").Router();

router.get("/", (req, res) => {
  req.template_data.csrf = req.csrfToken();
  res.render("homepage", req.template_data);
});

// Export the router
module.exports = router;
