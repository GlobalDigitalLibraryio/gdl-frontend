// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet, injectGlobal, css } from 'styled-components';
import { normalize } from 'polished';

// See https://www.styled-components.com/docs/advanced#nextjs

// Add global styles
// eslint-disable-next-line no-unused-expressions
const globalStyles = css`
  ${normalize(true)} *, *:before, *:after {
    box-sizing: inherit;
  }

  html {
    box-sizing: border-box;
    font-size: 16px;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Source Sans Pro', sans-serif;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    background: #eff0f2;
    color: #444444;

    a {
      color: #20588f;
    }

    small {
      color: #8a6666;
    }
  }
`;

// eslint-disable-next-line no-unused-expressions
injectGlobal`
  ${globalStyles}
`;

class GDLDocument extends Document {
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
          <title>Global Digital Library</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            rel="stylesheet"
            href="//fonts.googleapis.com/css?family=Source+Sans+Pro:400,600,700"
            type="text/css"
          />
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

export { GDLDocument as default, globalStyles };
