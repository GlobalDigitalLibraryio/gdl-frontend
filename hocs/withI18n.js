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
import { canonical } from '../config';
// Currently we only support English
import catalog from '../locale/en/messages';

type Props = {
  language: string,
  catalog: string,
  url?: {
    asPath: string
  }
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

      return {
        ...composedInitialProps,
        language
      };
    }

    render() {
      const languages = Object.keys(translations);
      const { language, ...props } = this.props;
      // Make sure URL exists here. If there is a 404 it doesn't
      const url = props.url && new Url(`${canonical}/${props.url.asPath}`);
      if (url) {
        delete url.query.hl;
      }
      // Wrap our page with the i18n provider and add alternate links to the other supported languages in the head

      return (
        <I18nProvider
          language={language}
          catalogs={{
            [language]: translations[language]
          }}
        >
          <Head>
            {url && (
              <React.Fragment>
                <link
                  href={url.toString()}
                  hrefLang="x-default"
                  rel="alternate"
                />
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
              </React.Fragment>
            )}
          </Head>
          <I18nPage {...props} />
        </I18nProvider>
      );
    }
  };
};
