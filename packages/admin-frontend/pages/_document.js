import NextDocument, { Head, Main, NextScript } from 'next/document';
import React from 'react';
import { globalVarName, GDL_ENVIRONMENT } from 'gdl-config';

const isDev = process.env.NODE_ENV !== 'production';
const cssPath =
  (isDev ? 'http://localhost:3010/' : '/admin/') + '_next/static/style.css';

export default class Document extends NextDocument {
  render() {
    return (
      <html>
        <Head>
          <link rel="stylesheet" href={cssPath} />
          <title>Admin | Global Digital Library</title>

          {/* Since we use immutable deployments, we inject the environment variable so the client can lookup the correct configuration */}
          <script
            dangerouslySetInnerHTML={{
              __html: `window.${globalVarName} = '${GDL_ENVIRONMENT}';`
            }}
          />
          {/* Custom JSS insertion point, so our Emotion styles takes precedence. This is used on the client. See withMuiRoot */}
          <noscript id="jss-insertion-point" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
