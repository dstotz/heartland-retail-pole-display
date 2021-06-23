# Heartland Retail Pole Display

This starts up a web app that can be used to display POS ticket information on a remote display. This is useful for satisfying the pole display requirements for certain states or just showing the end user live information for order accuracy

## Setup

Requires [Docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/)

Start the web app with `docker-compose up` and it will start both the API proxy any the web app. You can then access the pole display at `http://localhost:9000`

The first time you access the pole display on a new browser, it will open the setup page so you can configure it.

You will need your subdomain (ex. "derek" for derek.retail.heartland.us) and an [API token](https://dev.retail.heartland.us/#authentication) from a user in your account.

### Settings

You can access the in-app settings by pressing/clicking on the bottom left, top right, and top left corners in any order within 10 seconds. Or by clicking and holding in one of those 3 corners for 3 seconds.

#### Required setings

The Subdomain, API Token, and Station are required to be able to function. If using a tablet for the display recommend logging in to your station and generating an [API token](https://dev.retail.heartland.us/#authentication) on the device you will be using as the display to avoid needing to manually enter the long API token.

##### Polling frequency

This allows you to configure the frequency at which the display updates. The default speed is every second, but if you have a slow or metered internet connection, you can reduce it to a slower polling speed.

##### Idle ticket timeout

This will allow the ticket to stop being displayed if no updates have been made within a specific timeframe. This will make it so that if the sales rep leaves the register without voiding the ticket, it will automatically stop being shown until the ticket is updated again. Currently only works on POS v1 so it is ignored on POS v2

##### Show splash screen

When enabled the content at the splash screen URL will be displayed between sales

##### Splash screen URL

This will allow you to show content whenever a ticket is not in progress. The default frame window is full width x 500px or 350px if the show logo option is enabled.

Pro-tip: To display a YouTube video as your splash screen such as an advertisement you have published, you can do so by clicking the Share button on the video and choosing the Embed option. From there you will need to copy the URL that will look something like `https://www.youtube.com/embed/<video_id>?controls=0`. You will want to then add on the following to the end of your URL to make it start automatically, loop, and be muted `&autoplay=1&mute=1&loop=1&playlist=<video_id>`. So if your video ID is `bn56apBLAJc` then your full Splash screen URL would be `https://www.youtube.com/embed/bn56apBLAJc?controls=0&autoplay=1&mute=1&loop=1&playlist=bn56apBLAJc`

##### Splash screen can be interacted with

When enabled, the content at the splash screen URL will allow interaction. This means if showing a YouTube video, it can be paused or changed. But if displaying some sort of form, enabling this will allow the customer to fill it out.

##### Show logo

This fetches your logo from Heartland Retail and displays it along the top of the display. The max height for the logo display is 150px.

##### Show [thing]

Toggles if that element should be displayed to the customer or not

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
