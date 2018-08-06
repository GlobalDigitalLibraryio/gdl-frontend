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

import type { Context } from '../types';
import config from '../config';
import polyfills from '../polyfills';

// This is an import with a sideeffect :/
// eslint-disable-next-line no-unused-vars
import injectGlobalStyles from '../style/globalStyles';

const favIcon = require('../static/img/favicon-32x32.png');
const precomposed57 = require('../static/img/apple-icon-57x57-precomposed.png');
const precomposed72 = require('../static/img/apple-icon-72x72-precomposed.png');
const precomposed114 = require('../static/img/apple-icon-114x114-precomposed.png');
const precomposed144 = require('../static/img/apple-icon-144x144-precomposed.png');

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
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          {/* IE automatically looks for browserconfig.xml in the root directory of the server if this is not explictly turned off */}
          <meta name="msapplication-config" content="none" />
          <meta
            name="keywords"
            content="Books, Reading, Children, Library, Learning"
          />
          {config.BLOCK_SEARCH_INDEXING && (
            <meta name="robots" content="noindex, nofollow" />
          )}
          {config.GDL_ENVIRONMENT === 'prod' && (
            <meta
              name="google-site-verification"
              content="t5dnhhLP6IP-A-0-EPdggXp7th33SJI_dgqLv9vkAcA"
            />
          )}
          {/* Twitter */}
          <meta name="twitter:site" content="@GDigitalLibrary" />
          <meta name="twitter:card" content="summary" />
          {/* Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Global Digital Library" />

          <link rel="icon" type="image/png" href={favIcon} />
          <link
            rel="apple-touch-icon-precomposed"
            sizes="57x57"
            href={precomposed57}
          />
          <link
            rel="apple-touch-icon-precomposed"
            sizes="72x72"
            href={precomposed72}
          />
          <link
            rel="apple-touch-icon-precomposed"
            sizes="114x114"
            href={precomposed114}
          />
          <link
            rel="apple-touch-icon-precomposed"
            sizes="144x144"
            href={precomposed144}
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
          />

          {/* Since we use immutable deployments, we inject the environment variable so the client can lookup the correct configuration */}
          <script
            dangerouslySetInnerHTML={{
              __html: `window.${config.GLOBAL_VAR_NAME} = '${
                config.GDL_ENVIRONMENT
              }';`
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
