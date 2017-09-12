// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

/* eslint-disable no-underscore-dangle, no-eval, import/no-extraneous-dependencies */

import * as React from 'react';
import { I18nProvider } from 'lingui-react';
import Head from 'next/head';
import { unpackCatalog } from 'lingui-i18n';
import serializeJS from 'serialize-javascript';
import Url from 'domurl';

// required in development only (huge dependency)
const dev =
  process.env.NODE_ENV !== 'production'
    ? require('lingui-i18n/dev')
    : undefined;

type Props = {
  language: string,
  catalog: string,
  href: string,
};

// Currently next.js doesn't support variables with dynamic imports,
// So for now we have to add each translation specifically
const translations = {
  en: import('../locale/en/messages'),
};

export default (Page: React.ComponentType<any>) =>
  class PageWithI18n extends React.Component<Props> {
    static async getInitialProps(context) {
      // Evaluate the composed component's getInitialProps()
      let composedInitialProps;
      // Check if it actually is a next page
      if (typeof Page.getInitialProps === 'function') {
        composedInitialProps = await Page.getInitialProps(context);
      }

      // et the 'language' from the request object on the server.
      // In the browser, use the same values that the server serialized.
      const { req } = context;
      let { language } = req || window.__NEXT_DATA__.props;

      // Fallback to english if the language isn't found in the translations object
      if (!(language in translations)) {
        language = 'en';
      }

      // Load the translation
      // It contains functions, so we use this lib to serialize it
      const catalog = serializeJS(await translations[language]);

      let href;
      if (process.browser) {
        // In the browser, we simly read the window location
        href = window.location.href;
      } else {
        // On the server, we build it up based on the request object
        href = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      }

      return {
        ...composedInitialProps,
        language,
        catalog,
        href,
      };
    }

    render() {
      const languages = Object.keys(translations);
      const { language, href, catalog, ...props } = this.props;
      const url = new Url(href);
      delete url.query.hl;
      // Wrap our page with the i18n provider and add alternate links to the other supported languages in the head

      // The translation contains serialized functions. So we need to use eval here :/
      return (
        <I18nProvider
          language={language}
          catalogs={{
            [language]: unpackCatalog(eval(`(${catalog})`)),
          }}
          development={dev}
        >
          <Head>
            <link href={url.toString()} rel="canonical" />
            <link href={url.toString()} hrefLang="x-default" rel="alternate" />
            {languages.map(lang => {
              url.query.hl = lang;
              return (
                <link
                  key={lang}
                  href={url.toString()}
                  hrefLang={lang}
                  rel="alternate"
                />
              );
            })}
          </Head>
          <Page {...props} />
        </I18nProvider>
      );
    }
  };
