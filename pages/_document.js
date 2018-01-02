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
    /* eslint-disable react/no-danger */

    return (
      <html lang={this.props.language}>
      <Head>
        <title>Global Digital Library</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <script dangerouslySetInnerHTML={{ __html: `window.${config.GLOBAL_VAR_NAME} = '${process.env.GDL_ENVIRONMENT || 'test'}';` }} />
        <script dangerouslySetInnerHTML={{__html: `window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;ga('create', '${config.googleAnalyticsTrackingID}', 'auto');ga('send', 'pageview');`}} />
        <script async src="https://www.google-analytics.com/analytics.js"/>
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
