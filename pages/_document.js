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
import { theme } from '../hocs/withTheme';

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
    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI',
      'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
      'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    background: ${theme.grays.gallery};
    color: ${theme.grays.dark};

    a {
      color: #1566b6;
      text-decoration: none;
    }

    strong {
      font-weight: bold;
    }

    button,
    [role='button'] {
      cursor: pointer;
    }
  }
`;

// eslint-disable-next-line no-unused-expressions
injectGlobal`
  ${globalStyles}
`;

class GDLDocument extends Document {
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

export { GDLDocument as default, globalStyles };
