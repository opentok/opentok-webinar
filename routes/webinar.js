/**
 * Webinar handler for Tokinar
 */

let router = require("express").Router();

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

  // Create session in OpenTok
  req.OT.createSession({ mediaMode: "routed" }, function (err, session) {
    if (err) {
      console.log("Error", err);
      res.redirect("/webinar/new?e=500");
      return;
    }
    try {
      req.db.put("webinars", slug, {
        id: slug,
        name: name,
        presenter_pin: presenter_pin,
        viewer_pin: viewer_pin,
        session_id: session.sessionId
      });
    } catch (e) {
      console.log("Error", e);
      res.redirect("/webinar/new?e=500");
      return;
    }
    res.redirect(`/webinar/${slug}/present?i=created`);
  });
});

/**
 * Webinar middleware to fetch webinar info
 */
let load_webinar = (req, res, next) => {
  let w = req.db.get("webinars", req.params.webinar_id);
  if (w === null) {
    req.template_data.title = `Webinar ${req.params.webinar_id} not found`;
    res.status(404).render("webinar-not-found", req.template_data);
    return;
  }
  req.webinar = w;
  req.webinar.urls = {
    viewer: req.config.app.base_url + "/webinar/" + w.id,
    presenter: req.config.app.base_url + "/webinar/" + w.id + "/present"
  };
  req.template_data.opentok = {
    api_key: req.config.opentok.api_key,
    session_id: w.session_id,
    token: null
  };
  next();
};

/**
 * Returns a Middleware to get OpenTok Token based on role
 *
 * @param {string} role Valid values: "subscriber", "publisher" and
 * "moderator".
 * @return {Function} Returns a middleware closure.
 */
let get_token = role => {
  return (req, res, next) => {
    let token = req.OT.generateToken(req.webinar.session_id, {
      role: role,
      expireTime: Math.round((Date.now()/1000) + (60*60)) // 1 hour from now()
    });
    req.template_data.opentok.token = token;
    next();
  };
};

/**
 * Handler for presenter viewer
 *
 * @todo Enable PIN handling
 */
router.get("/:webinar_id/present", load_webinar, get_token("publisher"), (req, res) => {
  req.template_data.title = `[Presenter] Webinar: ${req.webinar.name}`;
  req.template_data.webinar = req.webinar;
  req.template_data.scripts.push("presenter");
  res.render("webinar-presenter", req.template_data);
});

/**
 * Handler for webinar's viewer
 *
 * @todo Enable PIN handling
 */
router.get("/:webinar_id", load_webinar, get_token("subscriber"), (req, res) => {
  req.template_data.title = `Webinar: ${req.webinar.name}`;
  req.template_data.webinar = req.webinar;
  req.template_data.scripts.push("viewer");
  res.render("webinar-viewer", req.template_data);
});

// Export the router
module.exports = router;
