// Copyright 2016 Kaustav Das Modak
//
// Licensed under the Apache License, Version 2.0 (the "License"); you
// may not use this file except in compliance with the License. You may
// obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
// implied. See the License for the specific language governing
// permissions and limitations under the License.

let router = require("express").Router();

/**
 * Route for creating new webinar
 */
router.get("/new", (req, res) => {
  res.render("webinar-new", { title: "Create Webinar"});
});

/**
 * Route for handling webinar creation form submission
 */
router.post("/new", (req, res) => {
  // TODO: Do actual handling. Use `req.body`.
  res.render("webinar-new", { title: "Created new Webinar"});
});


// Export the router
module.exports = router;
