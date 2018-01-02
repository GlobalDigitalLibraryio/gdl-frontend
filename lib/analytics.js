import ReactGA from 'react-ga'
import Router from 'next/router';
import config from '../config';


export const initGA = () => {
  ReactGA.initialize(config.googleAnalyticsTrackingID);
};

export const logPageView = () => {
  if (!window.GA_INITIALIZED) {
    initGA();
    window.GA_INITIALIZED = true
  }
  ReactGA.set({page: window.location.pathname});
  ReactGA.pageview(window.location.pathname);
};


Router.onRouteChangeComplete = () => {
  logPageView();
};
