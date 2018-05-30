// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { I18nProvider } from '@lingui/react';

// Currently we only support English
import catalog from '../locale/en/messages';

// For now we have to add each translation here
const translations = {
  en: catalog
};

// Currently we only support English
const language = 'en';

export default class GdlI18nProvider extends React.Component<*> {
  render() {
    return (
      <I18nProvider
        language="en"
        catalogs={{
          [language]: translations[language]
        }}
        {...this.props}
      />
    );
  }
}
