import Document, { Head, Main, NextScript } from 'next/document';

const isDev = process.env.NODE_ENV !== 'production';
const cssPath = (isDev ? "/" : "/admin/") + "_next/static/style.css";

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <link rel="stylesheet" href={cssPath} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
