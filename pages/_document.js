// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { injectGlobal } from 'emotion';
import { extractCritical } from 'emotion-server';
import type { Context } from '../types';
import globalStyles from '../style/globalStyles';
import config from '../config';
import { DEFAULT_TITLE } from '../components/Head';

const favIcon = require('../static/img/favicon-32x32.png');
const precomposed57 = require('../static/img/apple-icon-57x57-precomposed.png');
const precomposed72 = require('../static/img/apple-icon-72x72-precomposed.png');
const precomposed114 = require('../static/img/apple-icon-114x114-precomposed.png');
const precomposed144 = require('../static/img/apple-icon-144x144-precomposed.png');

injectGlobal`
  ${globalStyles}
`;

/**
 * We cheat a bit and add next-head to a couple of the tags, so we can ovveride them later if needed
 */
export default class GDLDocument extends Document {
  static getInitialProps({ renderPage, req }: Context & { renderPage: any }) {
    const page = renderPage();
    const styleTags = extractCritical(page.html);

    return {
      ...page,
      // $FlowFixMe How to handle that we inject lanugage in the request object on the express side?
      language: req.language,
      ...styleTags,
      // $FlowFixMe This is only rendered on the server, so req shouldn't be undefined
      url: `${req.protocol}://${req.headers.host}${req.originalUrl}`
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

          <script
            dangerouslySetInnerHTML={{
              __html: `window.${config.GLOBAL_VAR_NAME} = '${
                config.GDL_ENVIRONMENT
              }';`
            }}
          />
          {/* Polyfill only the minimum number of methods necessary for IE11 */}
          <script
            src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Object.assign,Object.entries,String.prototype.includes,Array.prototype.find,Array.prototype.includes"
            defer
            async
          />
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
