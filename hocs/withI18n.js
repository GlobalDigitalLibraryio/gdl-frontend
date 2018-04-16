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
import Url from 'domurl';
import type { Context } from '../types';
// Currently we only support English
import catalog from '../locale/en/messages';

type Props = {
  language: string,
  catalog: string,
  href: string
};

// For now we have to add each translation here
const translations = {
  en: catalog
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
        href
      };
    }

    render() {
      const languages = Object.keys(translations);
      const { language, href, ...props } = this.props;
      const url = new Url(href);
      delete url.query.hl;
      // Wrap our page with the i18n provider and add alternate links to the other supported languages in the head

      return (
        <I18nProvider
          language={language}
          catalogs={{
            [language]: translations[language]
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
