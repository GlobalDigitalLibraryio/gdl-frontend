import ReactGA from 'react-ga'
import Router from 'next/router';
import config from '../config';

let GA_INITIALIZED = false;

const logPageView = () => {
  if (process.browser) {
    console.log('Logging the page');
    if (!GA_INITIALIZED) {
      console.log('Initialising');
      ReactGA.initialize(config.googleAnalyticsTrackingID);
      GA_INITIALIZED = true
    }
    ReactGA.set({page: window.location.pathname});
    ReactGA.pageview(window.location.pathname);
  }
};

Router.onRouteChangeComplete = () => {
  logPageView();
};

export default logPageView;
