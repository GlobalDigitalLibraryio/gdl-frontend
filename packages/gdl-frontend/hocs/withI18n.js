// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { I18nProvider, withI18n } from '@lingui/react';

// Currently we only support English
import catalog from '../locale/en/messages';
import type { Context } from '../types';

type Props = {
  language: string
};

// For now we have to add each translation here
const translations = {
  en: catalog
};

/**
 * A HoC that that faciliates our i18n layer
 */
export default (App: React.ComponentType<any>) => {
  const AppWithI18n = withI18n()(App);

  return class I18n extends React.Component<Props> {
    static displayName = 'withI18n(App)';

    static getInitialProps(ctx: Context) {
      // Check if it actually is a next page
      return (
        typeof App.getInitialProps === 'function' && App.getInitialProps(ctx)
      );
    }

    render() {
      // Wrap our page with the i18n provider and add alternate links to the other supported languages in the head

      // Currently we only support English
      const language = 'en';

      return (
        <I18nProvider
          language="en"
          catalogs={{
            [language]: translations[language]
          }}
        >
          <AppWithI18n {...this.props} />
        </I18nProvider>
      );
    }
  };
};
