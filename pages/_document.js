/**
 * Copyright (c) 2017-present, Global Digital Library.
 * 
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */

// @flow
import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

// See https://www.styled-components.com/docs/advanced#nextjs

export default class MyDocument extends Document {
  static async getInitialProps(context) {
    // Wait for the language on the request (see server.js) so we can set the lang attribute on the html tag
    const props = await super.getInitialProps(context);
    const { req: { language } } = context;
    return {
      ...props,
      language,
    };
  }
  render() {
    const sheet = new ServerStyleSheet();
    const main = sheet.collectStyles(<Main />);
    const styleTags = sheet.getStyleElement();
    return (
      <html lang={this.props.language}>
        <Head>
          <title>My page</title>
          {styleTags}
        </Head>
        <body>
          <div className="root">{main}</div>
          <NextScript />
        </body>
      </html>
    );
  }
}
