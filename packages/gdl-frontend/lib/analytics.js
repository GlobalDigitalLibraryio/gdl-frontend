// @flow
import ReactGA from 'react-ga';
import getConfig from 'next/config';
import type { ConfigShape } from '../types';

const {
  publicRuntimeConfig: { googleAnalyticsId }
}: ConfigShape = getConfig();

let GA_INITIALIZED = false;

export function initGA() {
  if (googleAnalyticsId && !GA_INITIALIZED) {
    ReactGA.initialize(googleAnalyticsId);
    GA_INITIALIZED = true;
  }
}

export function logPageView() {
  if (GA_INITIALIZED) {
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
  }
}

export function logEvent(category: string, action: string, label?: string) {
  if (GA_INITIALIZED) {
    ReactGA.event({ category, action, label });
  }
}
