// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { Trans } from '@lingui/react';

import type { Language } from '../../types';
import Menu, { MenuItem } from '../Menu';

type Props = {
  selectedLanguageCode: ?string,
  onSelectLanguage: Language => void,
  languages: Array<Language>,
  onClose: (
    event:
      | SyntheticMouseEvent<any>
      | SyntheticKeyboardEvent<any>
      | KeyboardEvent
  ) => void
};

export default class TranslationLanguageMenu extends React.Component<Props> {
  render() {
    const {
      languages,
      selectedLanguageCode,
      onClose,
      onSelectLanguage
    } = this.props;

    const selectedLanguage = languages.find(
      l => l.code === selectedLanguageCode
    );

    // We don't want to display the seelected language in the list
    const filteredLanguages = selectedLanguage
      ? languages.filter(l => l !== selectedLanguage)
      : languages;

    return (
      <Menu heading={<Trans>Choose language</Trans>} onClose={onClose}>
        {selectedLanguage && (
          <MenuItem showKeyLine isSelected>
            {selectedLanguage.name}
          </MenuItem>
        )}
        {filteredLanguages.map(language => (
          <MenuItem
            key={language.code}
            onClick={() => onSelectLanguage(language)}
          >
            {language.name}
          </MenuItem>
        ))}
      </Menu>
    );
  }
}
