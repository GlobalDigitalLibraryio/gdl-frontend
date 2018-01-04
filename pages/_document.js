// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet, injectGlobal } from 'styled-components';
import globalStyles from '../style/globalStyles';
import config from '../config';



// eslint-disable-next-line no-unused-expressions
injectGlobal`
  ${globalStyles}
`;


/**
 * We cheat a bit and add next-head to a couple of the tags, so we can ovveride them later if needed
 */
export default class GDLDocument extends Document {
  static getInitialProps({ renderPage, req }) {
    const sheet = new ServerStyleSheet();

    const page = renderPage(App => props =>
      sheet.collectStyles(<App {...props} />),
    );

    const styleTags = sheet.getStyleElement();

    return {
      ...page,
      language: req.language,
      styleTags,
      url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    };
  }

  render() {
    /* eslint-disable react/no-danger */

    return (
      <html lang={this.props.language}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          {/* Adding next-head to the following meta tag ensures it gets deduped properly on the client in our own Head component */}
          <meta property="og:url" content={this.props.url} className="next-head" />
          <script dangerouslySetInnerHTML={{ __html: `window.${config.GLOBAL_VAR_NAME} = '${process.env.GDL_ENVIRONMENT || 'test'}';` }} />
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
