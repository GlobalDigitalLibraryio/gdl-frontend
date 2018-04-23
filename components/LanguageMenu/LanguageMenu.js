// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { Trans } from '@lingui/react';

import { Link } from '../../routes';
import Menu, { MenuItem } from '../Menu';
import type { Language } from '../../types';
import { ActivityIndicator } from '../../elements';
import { spacing } from '../../style/theme';

type Props = {
  selectedLanguageCode: ?string,
  onSelectLanguage: Language => void,
  languages: Array<Language>,
  showActivityIndicator: boolean,
  linkProps?: (language: Language) => {},
  onClose: (
    event:
      | SyntheticMouseEvent<any>
      | SyntheticKeyboardEvent<any>
      | KeyboardEvent
  ) => void
};

export default class LanguageMenu extends React.Component<Props> {
  static defaultProps = {
    linkToLandingPage: false,
    showActivityIndicator: false
  };

  renderMenuItem = (language: Language) => {
    if (this.props.linkProps) {
      return (
        <Link key={language.code} passHref {...this.props.linkProps(language)}>
          <MenuItem onCustomClick={() => this.props.onSelectLanguage(language)}>
            {language.name}
          </MenuItem>
        </Link>
      );
    }

    return (
      <MenuItem
        key={language.code}
        onClick={() => this.props.onSelectLanguage(language)}
      >
        {language.name}
      </MenuItem>
    );
  };

  render() {
    const {
      languages,
      onClose,
      selectedLanguageCode,
      showActivityIndicator
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
        {showActivityIndicator ? (
          <ActivityIndicator
            size="large"
            style={{ marginTop: spacing.large }}
          />
        ) : (
          filteredLanguages.map(this.renderMenuItem)
        )}
      </Menu>
    );
  }
}
