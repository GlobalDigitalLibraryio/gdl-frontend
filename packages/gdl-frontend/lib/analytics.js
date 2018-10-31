// @flow
import GAnalytics from 'ganalytics';
import getConfig from 'next/config';
import type { ConfigShape } from '../types';

const {
  publicRuntimeConfig: { googleAnalyticsId }
}: ConfigShape = getConfig();

let ga;

export function initGA() {
  if (googleAnalyticsId && !ga) {
    ga = new GAnalytics(googleAnalyticsId, {}, true); // a pageview event will NOT be sent immediately upon initialization
  }
}

export function logPageView() {
  ga && ga.send('pageview');
}

// Define all allowed categories here, so we are able to group all datapoints correctly
type Category = 'Books' | 'User' | 'Navigation' | 'PWA';
type Action =
  // User
  | 'Login'
  // Books
  | 'Read'
  | 'Favorited'
  | 'Unfavorited'
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

export function logEvent(category: Category, action: Action, label?: string) {
  // See https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#events
  ga && ga.send('event', { ec: category, ea: action, el: label });
}
