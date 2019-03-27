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
import PropTypes from 'prop-types';
import { globalVarName, GDL_ENVIRONMENT } from 'gdl-config';

import type { Context } from '../types';
import polyfills from '../polyfills';
import config from '../config';

const favIcon = '/static/img/favicon-32x32.png';
const icon192x192 = '/static/img/icon-192x192.png';
const appleTouchIcon192x192 = '/static/img/apple-touch-icon-192x192.png';

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

    return {
      ...page,
      pageContext,
      // $FlowFixMe How to handle that we inject lanugage in the request object on the express side?
      language: req.language
    };
  }

  render() {
    return (
      <html lang={this.props.language}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            id="theManifest"
            rel="manifest"
            href="/static/manifest/manifest.json"
          />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          {/* Enable client hints for response images for browsers that support it (Chrome mobile only for now).
            See https://cloudinary.com/blog/client_hints_and_responsive_images_what_changed_in_chrome_67
            This causes trouble... Disabling for now
            <meta httpEquiv="Accept-CH" content="DPR, Viewport-Width, Width" />
          */}
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
            crossOrigin="anonymous"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
          />

          {/* Since we use immutable deployments, we inject the environment variable so the client can lookup the correct configuration
          TODO: Remove the manifest removal hack once Safari plays nicer with PWA
          https://github.com/GlobalDigitalLibraryio/issues/issues/469
          */}
          <script
            dangerouslySetInnerHTML={{
              __html: `window.${globalVarName} = '${GDL_ENVIRONMENT}';
if (/iP(?:hone|ad|od)/.test(navigator.userAgent)) {
  document.head.removeChild(document.getElementById('theManifest'))
}`
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
        </Head>
        <body>
          <Main />
          <NextScript features={polyfills} allowUserMonitoring={false} />
        </body>
      </html>
    );
  }
}
