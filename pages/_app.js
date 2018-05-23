// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import NextApp from 'next/app';

import Raven from '../lib/raven';

export default class App extends NextApp {
  // Capture errors and report them to Sentry
  componentDidCatch(error, errorInfo) {
    Raven.captureException(error);

    // This is needed to render errors correctly in development / production
    super.componentDidCatch(error, errorInfo);
  }
}
