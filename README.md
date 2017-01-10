Tokinar
=========

A simple Webinar application based on OpenTok.

[![Deploy to Heroku](https://img.shields.io/badge/Deploy-Heroku-blue.svg)](https://heroku.com/deploy?template=https://github.com/kaustavdm/tokinar) [![Demo mirror #1](https://img.shields.io/badge/Demo-mirror_1-green.svg)](https://tokinar.kaustavdm.in)

## How it works

Tokinar treats a webinar as a uni-directional broadcast from 1 presenter to multiple viewers. The presenter can share screen and/or their camera, along with their audio. Presenters are given URLs that they can share with their viewers to join the webinar. Viewers' screens adjust depending on whether the presenter is sharing both screen and camera, only camera or only screen.

Presenter tokens are created with the `role` as `publisher` and viewer tokens are created with the `role` as `subscriber`. Presenters are shown number of viewers by listening to OpenTok events and this is done entirely client-side. There is no OpenTok callback integration.

**A few notes:**

- Screen-sharing is implemented only for Chrome.
- OpenTok session IDs and tokens are created on the server-side and embedded in the HTML, so they are already available when the DOM has been parsed. Even though this method avoids an extra HTTP request by skipping a XHR call to fetch tokens, it also results in creating a new token for each page generation. (For an example of a JSON-based API to fetch tokens, see the [opentok-green-screen](https://github.com/kaustavdm/opentok-green-screen) demo.)
- Currently, Tokinar supports only one presenter per webinar. It does not restrict to one presenter, but there are no layout controls implemented to handle multiple presenters, e.g., even though viewers can subscribe to multiple presenters, presenters of the same webinar will not be able to see each other.

### Project layout

- `app.js` - This is the main server script that loads the APIs and starts the NodeJS server.
- *`assets/`* - Client-side assets (styles, scripts, images) that are served as static files by the server.
  - `assets/js/tokinar.js` - Common client-side utilities.
  - `assets/js/presenter.js` - JavaScript loaded for presenter.
  - `assets/js/viewer.js` - JavaScript loaded for viewer.
- *`extensions/`* - Screen-sharing extensions.
- `config.sample.js` - Contains the project configuration. (See [Install](#install) instructions).
- *`libs/`* - Reusable utilities and libraries used by the application.
- *`routes/`* - Contains the routes used by Express to serve pages.
  - `routes/webinar.js` - Contains routes for webinar pages, including creating OpenTok sessions and tokens.
- *`views/`* - Server-side views that are rendered on requests.
  - `views/webinar-presenter.ejs` - The view rendered for a presenter.
  - `views/webinar-viewer.ejs` - The view rendered for a presenter.

## Requirements

- NodeJS v6.9+
- TokBox Account (API Key and Secret)

## Install

- Copy `config.sample.js` to `config.js` and edit configuration.
- Install dependencies: `npm install`
- Start the application with: `npm start`

### Deploy to Heroku

Alternatively, you can quickly deploy this project to Heroku by clicking the button below. You will need OpenTok API key and secret and Heroku will manage the rest.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/kaustavdm/tokinar)

### SSL requirements

You will need SSL to use this demo on latest browsers. You can either set up a proxy through nginx or apache and run this application without SSL, or you can let `node` serve it directly on SSL when you run `npm start`.

If you want `node` to serve this application using SSL, you will need to edit `config.js` and change `ssl.enabled` to `true`. Change the values in the `ssl` section to point to your key and certificate pair.

**Self-signed certificate**: If you have `openssl` installed and on `PATH`, you can run `npm run certs` to generate a self-signed certificate. This command will create `key.pem` and `cert.pem` in the project root, which are also the default value for the `ssl` configuration.

If you are deploying to Heroku, you do not need to worry about the SSL config.

## Credits

- Icon source - [Octicons:broadcast](https://octicons.github.com/icon/broadcast/).
