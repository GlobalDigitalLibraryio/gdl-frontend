// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React from 'react';
import NextDocument, { Head, Main, NextScript } from 'next/document';
import { extractCritical } from 'emotion-server';
import getPageContext from '../getPageContext';

import type { Context } from '../types';
import config from '../config';
import { DEFAULT_TITLE } from '../components/Head';

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
    const pageContext = getPageContext();

    const page = renderPage(Component => props => (
      <Component pageContext={pageContext} {...props} />
    ));

    const styleTags = extractCritical(page.html);

    return {
      ...page,
      pageContext,
      // $FlowFixMe How to handle that we inject lanugage in the request object on the express side?
      language: req.language,
      ...styleTags
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
    /* eslint-disable react/no-danger */

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
          <title>{DEFAULT_TITLE}</title>
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

          <script
            dangerouslySetInnerHTML={{
              __html: `window.${config.GLOBAL_VAR_NAME} = '${
                config.GDL_ENVIRONMENT
              }';`
            }}
          />
          <style
            id="jss-server-side"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: this.props.pageContext.sheetsRegistry.toString()
            }}
          />
          {/* Custom JSS insertion point, so our Emotion styles takes precedence */}
          <noscript id="jss-insertion-point" />
          <style dangerouslySetInnerHTML={{ __html: this.props.css }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
