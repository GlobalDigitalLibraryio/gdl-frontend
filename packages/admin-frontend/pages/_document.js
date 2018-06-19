import Document, { Head, Main, NextScript } from 'next/document';
import React from 'react';
import { globalVarName, GDL_ENVIRONMENT } from 'gdl-config';

const isDev = process.env.NODE_ENV !== 'production';
const cssPath = (isDev ? '/' : '/admin/') + '_next/static/style.css';

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <link rel="stylesheet" href={cssPath} />

          {/* Since we use immutable deployments, we inject the environment variable so the client can lookup the correct configuration */}
          <script
            dangerouslySetInnerHTML={{
              __html: `window.${globalVarName} = '${GDL_ENVIRONMENT}';`
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
