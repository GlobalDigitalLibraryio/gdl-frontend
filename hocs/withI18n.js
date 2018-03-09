// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { I18nProvider, withI18n } from '@lingui/react';
import Head from 'next/head';
import serializeJS from 'serialize-javascript';
import Url from 'domurl';
import type { Context } from '../types';

type Props = {
  language: string,
  catalog: string,
  href: string
};

// Currently next.js doesn't support variables with dynamic imports,
// So for now we have to add each translation specifically
const translations = {
  en: import('../locale/en/messages')
};

/**
 * A HoC that that faciliates our i18n layer
 */
export default (Page: React.ComponentType<any>) => {
  const I18nPage = withI18n()(Page);

  return class PageWithI18n extends React.Component<Props> {
    static async getInitialProps(context: Context) {
      // Evaluate the composed component's getInitialProps()
      let composedInitialProps;
      // Check if it actually is a next page
      if (typeof Page.getInitialProps === 'function') {
        composedInitialProps = await Page.getInitialProps(context);
      }

      // et the 'language' from the request object on the server.
      // In the browser, use the same values that the server serialized.
      const { req } = context;
      // $FlowFixMe: How to handle that we get 'language' on the request object?
      let { language } = req || window.__NEXT_DATA__.props;

      // Fallback to english if the language isn't found in the translations object
      if (!(language in translations)) {
        language = 'en';
      }

      // Load the translation
      // It contains functions, so we use this lib to serialize it
      const catalog = serializeJS(await translations[language]);

      let href;
      if (req != null) {
        // On the server, we build it up based on the request object
        href = `${req.protocol}://${req.headers.host}${req.originalUrl}`;
      } else {
        // In the browser, we simly read the window location
        href = window.location.href;
      }

      return {
        ...composedInitialProps,
        language,
        catalog,
        href
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
            [language]: eval(`(${catalog})`) // eslint-disable-line no-eval
          }}
        >
          <Head>
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
          <I18nPage {...props} />
        </I18nProvider>
      );
    }
  };
};
