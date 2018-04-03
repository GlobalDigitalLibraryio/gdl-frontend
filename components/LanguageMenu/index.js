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
import { Link } from '../../routes';
import Menu, { MenuItem } from '../Menu';

type Props = {
  selectedLanguageCode: string,
  isNestedMenu?: boolean,
  languages: Array<Language>,
  onClose: (
    event: | SyntheticMouseEvent<any>
    | SyntheticKeyboardEvent<any>
    | KeyboardEvent
  ) => void
};

export default class LanguageMenu extends React.Component<Props> {
  static defaultProps = {
    isNestedMenu: false
  };

  render() {
    const {
      selectedLanguageCode,
      languages,
      onClose,
      isNestedMenu
    } = this.props;

    const selectedLanguage = languages.find(
      l => l.code === selectedLanguageCode
    );

    // We don't want to display the selected language in the list
    const filteredLanguages = languages.filter(l => l !== selectedLanguage);

    return (
      <Menu
        heading={<Trans>Choose language</Trans>}
        onClose={onClose}
        isNestedMenu={isNestedMenu}
      >
        <MenuItem showKeyLine isSelected>
          {(selectedLanguage && selectedLanguage.name) || selectedLanguageCode}
        </MenuItem>
        {filteredLanguages.map(language => (
          <Link
            key={language.code}
            route="books"
            passHref
            params={{ lang: language.code }}
          >
            <MenuItem onCustomClick={onClose}>{language.name}</MenuItem>
          </Link>
        ))}
      </Menu>
    );
  }
}
