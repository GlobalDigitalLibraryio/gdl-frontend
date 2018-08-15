// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { NextScript } from '@engineerapart/nextscript';
import NextDocument, { Head, Main } from 'next/document';
import { extractCritical } from 'emotion-server';
import PropTypes from 'prop-types';
import { globalVarName, GDL_ENVIRONMENT } from 'gdl-config';

import type { Context } from '../types';
import polyfills from '../polyfills';
import { colors } from '../style/theme';
import config from '../config';

// This is an import with a sideeffect :/
// eslint-disable-next-line no-unused-vars
import injectGlobalStyles from '../style/globalStyles';

const favIcon = require('../static/img/favicon-32x32.png');
const icon192x192 = require('../static/img/icon-192x192.png');
const appleTouchIcon192x192 = require('../static/img/apple-touch-icon-192x192.png');

export default class Document extends NextDocument {
  static getInitialProps({ renderPage, req }: Context & { renderPage: any }) {
    // Needed to SSR MUI's styles
    let pageContext;
    const page = renderPage(Component => {
      const WrappedComponent = props => {
        pageContext = props.pageContext;
        return <Component {...props} />;
      };

      WrappedComponent.propTypes = {
        pageContext: PropTypes.object.isRequired
      };

      return WrappedComponent;
    });
    // Extract Emotion's styles for SSR
    const emotionStyles = extractCritical(page.html);

    return {
      ...page,
      pageContext,
      // $FlowFixMe How to handle that we inject lanugage in the request object on the express side?
      language: req.language,
      ...emotionStyles
    };
  }

  constructor(props: any) {
    super(props);
    const { __NEXT_DATA__, ids } = props;
    if (ids) {
      __NEXT_DATA__.ids = ids;
    }
  }

  render() {
    return (
      <html lang={this.props.language}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content={colors.default} />
          <link rel="manifest" href="/static/manifest/manifest.json" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          {/* IE automatically looks for browserconfig.xml in the root directory of the server if this is not explictly turned off */}
          <meta name="msapplication-config" content="none" />
          <meta
            name="keywords"
            content="Books, Reading, Children, Library, Learning"
          />

          {GDL_ENVIRONMENT !== 'prod' && (
            <meta name="robots" content="noindex, nofollow" />
          )}
          {GDL_ENVIRONMENT === 'prod' &&
            config.serverRuntimeConfig.googleSiteVerificationId && (
              <meta
                name="google-site-verification"
                content={config.serverRuntimeConfig.googleSiteVerificationId}
              />
            )}

          {/* Twitter */}
          <meta name="twitter:site" content="@GDigitalLibrary" />
          <meta name="twitter:card" content="summary" />
          {/* Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Global Digital Library" />

          <link rel="icon" href={favIcon} type="image/png" />
          <link
            rel="apple-touch-icon"
            sizes="192x192"
            href={appleTouchIcon192x192}
          />
          <link rel="icon" sizes="192x192" href={icon192x192} />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
          />

          {/* Since we use immutable deployments, we inject the environment variable so the client can lookup the correct configuration */}
          <script
            dangerouslySetInnerHTML={{
              __html: `window.${globalVarName} = '${GDL_ENVIRONMENT}';`
            }}
          />

          {/* The JSS styles (for MUI) hare injected here */}
          <style
            id="jss-server-side"
            dangerouslySetInnerHTML={{
              __html: this.props.pageContext.sheetsRegistry.toString()
            }}
          />

          {/* Custom JSS insertion point, so our Emotion styles takes precedence. This is used on the client. See withMuiRoot */}
          <noscript id="jss-insertion-point" />

          {/* Emotion's styles are injected here. We want them below the JSS styles, so we can overwrite MUI css with Emotion */}
          <style dangerouslySetInnerHTML={{ __html: this.props.css }} />
        </Head>
        <body>
          <Main />
          <NextScript features={polyfills} allowUserMonitoring={false} />
        </body>
      </html>
    );
  }
}
