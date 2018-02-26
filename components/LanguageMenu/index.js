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
import Menu, { MenuItem } from '../Menuu';

type Props = {
  selectedLanguage: Language,
  isNestedMenu?: boolean,
  languages: Array<Language>,
  onClose: (
    event: SyntheticMouseEvent<any> | SyntheticKeyboardEvent<any>
  ) => void
};

export default class LanguageMenu extends React.Component<Props> {
  static defaultProps = {
    isNestedMenu: false
  };

  render() {
    const { selectedLanguage, languages, onClose, isNestedMenu } = this.props;
    return (
      <Menu
        heading={<Trans>Choose language</Trans>}
        onClose={onClose}
        isNestedMenu={isNestedMenu}
      >
        <MenuItem showKeyLine isSelected>
          {selectedLanguage.name}
        </MenuItem>
        {languages.map(language => (
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
