// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React, { Component, type Node } from 'react';
import { IntlProvider } from 'react-intl';
import * as Sentry from '@sentry/browser';
import type { Locale, Catalogs } from '../types';
import { fetchSiteTranslation } from '../fetch';
import { setSiteLanguage } from '../lib/storage';

// Currently we initially load English as default and fallback language
import enTranslations from '../locale/en/en.json';

type ChangeSiteAction = (e: { code: string, name: string }) => Promise<void>;

const defaultCatalog = {
  en: enTranslations
};

const GdlI18nContext = React.createContext<?{
  changeSiteLanguage: ChangeSiteAction
}>();
const GdlI18nConsumer = GdlI18nContext.Consumer;

// https://github.com/yahoo/react-intl/wiki/API
class GdlI18nProvider extends Component<
  { initialCatalog: Catalogs, initialSiteLanguage: string, children: Node },
  Locale
> {
  state = {
    language: this.props.initialSiteLanguage,
    catalog: this.props.initialCatalog
  };

  componentDidMount() {
    const { language } = this.state;
    setSiteLanguage(language);
  }

  changeSiteLanguage = async (e: {
    code: string,
    name: string
  }): Promise<void> => {
    const translation = await fetchSiteTranslation(e.code);
    if (translation.isOk) {
      // We saves the choosen site language in a cookie
      setSiteLanguage(e.code);
      this.setState({
        catalog: translation.data[e.code],
        language: e.code
      });
    } else {
      // If its a 404 we know that we don't have translations for that language
      if (translation.statusCode !== 404) {
        Sentry.captureEvent({
          message: `GdlI18n - ${translation.error}`,
          extra: {
            statusCode: translation.statusCode
          }
        });
      }
      // If translations is not found or we get an error, we default to English
      setSiteLanguage('en');
      this.setState({
        catalog: defaultCatalog['en'],
        language: 'en'
      });
    }
  };

  render() {
    const { language, catalog } = this.state;
    return (
      <GdlI18nContext.Provider
        value={{
          changeSiteLanguage: this.changeSiteLanguage
        }}
      >
        <IntlProvider
          key={language}
          locale="en"
          defaultLocale="en"
          messages={catalog}
        >
          {this.props.children}
        </IntlProvider>
      </GdlI18nContext.Provider>
    );
  }
}

export { GdlI18nProvider, GdlI18nConsumer };
