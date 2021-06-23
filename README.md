# Heartland Retail Pole Display

This starts up a web app that can be used to display POS ticket information on a remote display. This is useful for satisfying the pole display requirements for certain states or just showing the end user live information for order accuracy

## Setup

Requires [Docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/)

Start the web app with `docker-compose up` and it will start both the API proxy any the web app. You can then access the pole display at `http://localhost:9000`

The first time you access the pole display on a new browser, it will open the setup page so you can configure it.

You will need your subdomain (ex. "derek" for derek.retail.heartland.us) and an [API token](https://dev.retail.heartland.us/#authentication) from a user in your account.

### Settings

You can access the in-app settings by pressing/clicking on the bottom left, top right, and top left corners in any order within 10 seconds. Or by clicking and holding in one of those 3 corners for 3 seconds.

From the settings you can change your Subdomain, API token, and station to watch. Other UI settings will likely also be available in the future for themeing. Note: the station list will not populate until you have a valid API Token and Subdomain entered.

## Development

There is a `server` and a `ui`. Both are bundled together with a `docker-compose.yml` file so you can start a local server with `docker-compose up`

### Server

The `server` is an extremely lightweight [Sinatra](http://sinatrarb.com/) server that just proxy's the API request to avoid CORS issues from the web browser

### UI

The `ui` is a [React](https://reactjs.org/) app running on [NodeJS](https://nodejs.org/en/) boostrapped with [Create React App](https://github.com/facebook/create-react-app)

## Deploying

You can deploy this to Heroku as two separate apps. One for the server and one for the UI. The only thing that should need to be configured on Heroku after deploying is to set the Environment variable `REACT_APP_BASE_API_URL` to whatever the server app's address is, then restart the dynos.

## TODO

- [ ] Finish writing documentation
- [ ] Certify app for PWM
- [ ] Get CORS set up so that we can eliminate the need for proxy server
- [ ] Add in themeing/dark mode
- [ ] Add setting for polling frequency
- [ ] Use compiled React instead of dev server for production
