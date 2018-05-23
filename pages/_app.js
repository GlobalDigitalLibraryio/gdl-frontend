// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import NextApp from 'next/app';
import { hydrate } from 'react-emotion';

import Raven from '../lib/raven';
import withTheme from '../hocs/withTheme';

// Adds server generated styles to the emotion cache.
// '__NEXT_DATA__.ids' is set in '_document.js'
if (typeof window !== 'undefined' && window.__NEXT_DATA__) {
  hydrate(window.__NEXT_DATA__.ids);
}

class App extends NextApp {
  // Capture errors and report them to Sentry
  componentDidCatch(error, errorInfo) {
    Raven.captureException(error);

    // This is needed to render errors correctly in development / production
    super.componentDidCatch(error, errorInfo);
  }

}

// Wrap the app with a themeprovider
export default withTheme(App);
