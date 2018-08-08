import ReactGA from 'react-ga';
import Router from 'next/router';
import getConfig from 'next/config';
import type { ConfigShape } from '../types';

const {
  publicRuntimeConfig: { googleAnalyticsId }
}: ConfigShape = getConfig();

let GA_INITIALIZED = false;

const logPageView = () => {
  if (process.browser && googleAnalyticsId) {
    if (!GA_INITIALIZED) {
      ReactGA.initialize(googleAnalyticsId);
      GA_INITIALIZED = true;
    }
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
  }
};

Router.onRouteChangeComplete = () => {
  logPageView();
};

export default logPageView;
