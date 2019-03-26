// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React, { Component } from 'react';
import { addLocaleData, IntlProvider } from 'react-intl';
import type { Locale } from '../types';
import { fetchSiteTranslation } from '../fetch';
import { setSiteLanguage } from '../lib/storage';

// Currently we initially load English as default and fallback language
import enTranslations from '../locale/en/en.json';

const defaultCatalog = {
  en: enTranslations
};

const GdlI18nContext = React.createContext<any>();
const GdlI18nConsumer = GdlI18nContext.Consumer;

// https://github.com/yahoo/react-intl/wiki/API
class GdlI18nProvider extends Component<
  { initialCatalog: *, initialSiteLanguage: string },
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

  changeSiteLanguage = async (e: { code: string, name: string }) => {
    const translation = await fetchSiteTranslation(e.code);
    if (translation.isOk) {
      // $FlowFixMe
      await this.setLocale(e.code);

      // We saves the choosen site language in a cookie
      setSiteLanguage(e.code);

      const translation = await this.getLanguageCatalog(e.code);
      this.setState(prevState => ({
        catalog: translation,
        language: e.code
      }));
    }
  };

  getLanguageCatalog = async (language: string) => {
    const translation = await fetchSiteTranslation(language);
    return translation.isOk ? translation.data[language] : defaultCatalog['en'];
  };

  setLocale = async (language: string) => {
    // $FlowFixMe
    const locale = await import(`react-intl/locale-data/${language}`);
    addLocaleData(locale.default[0]);
  };

  render() {
    const { language, catalog } = this.state;
    return (
      <GdlI18nContext.Provider
        value={{
          changeSiteLanguage: this.changeSiteLanguage
        }}
      >
        {/* $FlowFixMe: */}
        <IntlProvider
          key={language}
          locale={language}
          messages={catalog}
          {...this.props}
        />
      </GdlI18nContext.Provider>
    );
  }
}

export { GdlI18nProvider, GdlI18nConsumer };
