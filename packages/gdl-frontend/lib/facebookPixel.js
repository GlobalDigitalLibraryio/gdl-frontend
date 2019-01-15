// @flow
import ReactPixel from 'react-facebook-pixel';
import getConfig from 'next/config';
import type { ConfigShape } from '../types';

const {
  publicRuntimeConfig: { facebookPixelId }
}: ConfigShape = getConfig();

let REACT_PIXEL_INITIALIZED = false;

export function initFacebookPixel() {
  if (facebookPixelId && !REACT_PIXEL_INITIALIZED) {
    const options = {
      autoConfig: true,
      debug: true
    };
    console.log('facbook Pixel', facebookPixelId);
    ReactPixel.init(facebookPixelId, options);
    REACT_PIXEL_INITIALIZED = true;
  }
}

export function facebookPixelPageView() {
  if (REACT_PIXEL_INITIALIZED) {
    ReactPixel.pageView();
  }
}

// Define all allowed event categories here, so we are able to group all datapoints correctly
type EventCategory = 'PageView' | 'Search' | 'ViewContent';
type Action =
  // User
  | 'Login'
  // Books
  | 'Book details'
  | 'Read'
  | 'Favorited'
  // Navigation
  | 'Home'
  | 'Category'
  | 'Language'
  | 'Featured'
  | 'More - Search'
  | 'More - Browse'
  | 'Search';

//  This function makes it possible to use other events than 'PageView' to get statistics
export function logEventToFacebookPixel(
  category: EventCategory,
  action: Action,
  data: Object
) {
  if (REACT_PIXEL_INITIALIZED) {
    // track(event, data) : https://developers.facebook.com/docs/facebook-pixel/implementation/conversion-tracking#pixel-standard-events
    ReactPixel.track(category, { action: action, ...(data && data) });
  }
}
