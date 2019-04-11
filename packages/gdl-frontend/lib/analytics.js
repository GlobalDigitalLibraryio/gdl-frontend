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

// Define all allowed categories here, so we are able to group all datapoints correctly
export type Category = 'Books' | 'Games' | 'User' | 'Navigation' | 'PWA';
type Action =
  // User
  | 'Login'
  // Books
  | 'Read'
  | 'Play'
  | 'Favorited'
  | 'Unfavorited'
  | 'Available offline'
  | 'Remove offline'
  | 'Downloaded PDF'
  | 'Downloaded ePub'
  | 'Translate'
  | 'Report'
  | 'Shared'
  // Navigation
  | 'Home'
  | 'Category'
  | 'Language'
  | 'Featured'
  | 'More - Search'
  | 'More - Browse'
  // PWA
  | 'Prompted'
  | 'Added'
  | 'Dismissed';

/**
 * See https://github.com/react-ga/react-ga#reactgaeventargs
 * See https://support.google.com/analytics/answer/1033068?hl=en
 */
export function logEvent(category: Category, action: Action, label?: string) {
  if (GA_INITIALIZED) {
    ReactGA.event({ category, action, label });
  }
}
