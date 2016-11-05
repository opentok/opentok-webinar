/**
 * Webinar handler for Tokinar
 */

let router = require("express").Router();

let as_slug = s => {
  return s.toLowerCase().replace(/\W/g, "-");
};

/**
 * Route for creating new webinar
 */
router.get("/new", (req, res) => {
  req.template_data.title = "Create a Webinar";
  req.template_data.csrf = req.csrfToken();
  res.render("webinar-new", req.template_data);
});

/**
 * Route for handling webinar creation form submission
 */
router.post("/new", (req, res) => {
  let name = req.body.webinar_name ? req.body.webinar_name.trim() : "";
  let presenter_pin = req.body.webinar_presenter_pin ? req.body.webinar_presenter_pin.trim() : "";
  let viewer_pin = req.body.webinar_viewer_pin ? req.body.webinar_viewer_pin.trim() : "";

  if (!name) {
    res.redirect("/webinar/new?e=invalid_input");
    return;
  };

  let slug = req.utils.as_slug(name);
  if (req.db.exists("webinars", slug)) {
    res.redirect("/webinar/new?e=exists");
    return;
  }

  try {
    req.db.put("webinars", slug, {
      id: slug,
      name: name,
      presenter_pin: presenter_pin,
      viewer_pin: viewer_pin
    });
  } catch (e) {
    console.log("Error", e);
    res.redirect("/webinar/new?e=500");
    return;
  }
  res.redirect(`/webinar/${slug}/present?i=created`);
});


// Export the router
module.exports = router;
