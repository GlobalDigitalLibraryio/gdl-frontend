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

// See https://www.styled-components.com/docs/advanced#nextjs

// eslint-disable-next-line no-unused-expressions
injectGlobal`
  ${globalStyles}
`;

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
    };
  }

  render() {
    // Since we want immutable multi enviroment docker deployments, we add the environment to head here
    // We can then read it in env.js on both the client and the server
    // See https://github.com/zeit/next.js/issues/1488#issuecomment-289108931
    /* eslint-disable react/no-danger */
    const envScript = `window.GDL_ENVIRONMENT = '${process.env
      .GDL_ENVIRONMENT || 'test'}'`;

    return (
      <html lang={this.props.language}>
        <Head>
          <title>Global Digital Library</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <script dangerouslySetInnerHTML={{ __html: envScript }} />
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
