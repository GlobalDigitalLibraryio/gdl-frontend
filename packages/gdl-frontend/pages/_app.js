// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import NextApp, { Container as NextContainer } from 'next/app';
import { ApolloProvider } from 'react-apollo';
import Head from 'next/head';
import Router from 'next/router';
import getConfig from 'next/config';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import JssProvider from 'react-jss/lib/JssProvider';
import * as Sentry from '@sentry/browser';
import { withApollo } from '../apollo';
import type { ApolloClient } from 'react-apollo';

import OnlineStatusRedirectProvider from '../components/OnlineStatusRedirectProvider';
import getPageContext from '../getPageContext';
import initSentry from '../lib/initSentry';
import { GdlI18nProvider } from '../components/GdlI18nProvider';
import { addLocaleData } from 'react-intl';
import { LOGOUT_KEY } from '../lib/auth/token';
import { DEFAULT_TITLE } from '../components/Head';
import { logPageView, logEvent, initGA } from '../lib/analytics';
import { facebookPixelPageView, initFacebookPixel } from '../lib/facebookPixel';
import { register as registerServiceWorker } from '../registerServiceWorker';
import OfflineLibrary from '../lib/offlineLibrary';
import GlobalStyles from '../components/GlobalStyles';
import { getSiteLanguage } from '../lib/storage';
import { parseCookies } from '../utils/util';
import { fetchSiteTranslation } from '../fetch';

import type { Context, ConfigShape } from '../types';

const {
  publicRuntimeConfig: { DEFAULT_LANGUAGE }
}: ConfigShape = getConfig();

// Load falback locale catalog with english
const en = require('../locale/en/en');

// We want to do this as soon as possible so if the site crashes during rehydration we get the event
initSentry();

// Register React Intl's locale data for the user's locale in the browser. This
// locale data was added to the page by `pages/_document.js`. This only happens
// once, on initial page load in the browser.
if (typeof window !== 'undefined' && window.ReactIntlLocaleData) {
  Object.keys(window.ReactIntlLocaleData).forEach(lang => {
    addLocaleData(window.ReactIntlLocaleData[lang]);
  });
}

class App extends NextApp {
  static async getInitialProps({
    Component,
    ctx
  }: {
    Component: any,
    ctx: Context
  }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const { req, query } = ctx;
    // $FlowFixMe: localeCatalog is our own and not in Express' $Request type
    const response = req || window.__NEXT_DATA__.props;

    // $FlowFixMe: localeCatalog is our own and not in Express' $Request type
    let localeCatalog = response.localeCatalog;

    if (!localeCatalog) {
      const languageFromCookie =
        response.headers && parseCookies(response.headers.cookie);
      // $FlowFixMe: localeCatalog is our own and not in Express' $Request type
      const language: string =
        (query && query.lang) ||
        response.siteLanguage ||
        (languageFromCookie
          ? languageFromCookie['siteLanguage']
          : DEFAULT_LANGUAGE.code);

      localeCatalog = await fetchSiteTranslation(language);
      // If we dont find translations for selected language we default to english
      if (!localeCatalog.isOk) {
        localeCatalog = {
          [language]: en
        };
      }
    }

    const siteLanguage =
      (query && query.lang) || response.siteLanguage || getSiteLanguage(req);

    return { pageProps, localeCatalog, siteLanguage };
  }

  constructor(props: { apolloClient: ApolloClient }) {
    super(props);
    this.pageContext = getPageContext();
    // Pass off the apollo client instance to the offline library so it can
    // put all the offlined books in the cache
    if (process.browser && OfflineLibrary && props.apolloClient) {
      OfflineLibrary.populateApolloCache(props.apolloClient);
    }
  }

  componentDidCatch(error: *, errorInfo: *) {
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
      Sentry.captureException(error);
    });
    // This is needed to render errors correctly in development / production
    super.componentDidCatch(error, errorInfo);
  }

  componentDidMount() {
    // Listen to log out events (across all tabs)
    window.addEventListener('storage', this.logout, false);

    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }

    // Setup Google Analytics and Facebook pixel to log the current page and subsequent other pages
    initGA();
    logPageView();

    // Set up Facebook pixel
    initFacebookPixel();
    facebookPixelPageView();

    Router.router.events.on('routeChangeComplete', () => {
      logPageView();
      facebookPixelPageView();
    });

    // This fires when a user is prompted to add the app to their homescreen
    // We use it to track it happening in Google Analytics so we have those sweet metrics
    window.addEventListener('beforeinstallprompt', e => {
      logEvent('PWA', 'Prompted');
      e.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'dismissed') {
          logEvent('PWA', 'Dismissed');
        } else {
          logEvent('PWA', 'Added');
        }
      });
    });
  }

  componentWillUnmount() {
    // Stop listening to logout events
    window.removeEventListener('storage', this.logout, false);
    Router.router.events.off('routeChangeComplete', () => {
      logPageView();
      facebookPixelPageView();
    });
  }

  /**
   * Redirect to front page on logout. Ensures we don't display content in another tab when the user has logged out
   */
  logout = (event: StorageEvent) => {
    if (event.key === LOGOUT_KEY && event.newValue) {
      Router.push(`/?logout=${event.newValue}`);
    }
  };

  render() {
    const {
      Component,
      pageProps,
      apolloClient,
      localeCatalog,
      siteLanguage
    } = this.props;
    return (
      <NextContainer>
        <GlobalStyles />
        <ApolloProvider client={apolloClient}>
          <Head>
            <script
              dangerouslySetInnerHTML={{
                __html: `window.__LOCALE_CATALOG__=${JSON.stringify(
                  this.props.localeCatalog
                ).replace(/</g, '\\u003c')};`
              }}
            />
            <title>{DEFAULT_TITLE}</title>
          </Head>
          <GdlI18nProvider
            initialCatalog={localeCatalog}
            initialSiteLanguage={siteLanguage}
          >
            {/* Wrap every page in Jss and Theme providers */}
            <JssProvider
              jss={this.pageContext.jss}
              registry={this.pageContext.sheetsRegistry}
              generateClassName={this.pageContext.generateClassName}
            >
              {/* MuiThemeProvider makes the theme available down the React
              tree thanks to React context. */}
              <MuiThemeProvider
                theme={this.pageContext.theme}
                sheetsManager={this.pageContext.sheetsManager}
              >
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <OnlineStatusRedirectProvider>
                  {/* Pass pageContext to the _document though the renderPage enhancer
                to render collected styles on server side. */}
                  <Component pageContext={this.pageContext} {...pageProps} />
                </OnlineStatusRedirectProvider>
              </MuiThemeProvider>
            </JssProvider>
          </GdlI18nProvider>
        </ApolloProvider>
      </NextContainer>
    );
  }
}

// Register service worker for clients that support it
registerServiceWorker();

export default withApollo(App);
