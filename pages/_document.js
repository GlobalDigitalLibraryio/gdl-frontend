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
          {/* Twitter */}
          <meta name="twitter:site" content="@GDigitalLibrary" />
          <meta name="twitter:card" content="summary" />
          {/* Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Global Digital Library" />

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
