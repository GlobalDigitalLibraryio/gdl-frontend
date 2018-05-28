// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { Fragment, type Node } from 'react';
import { Trans } from '@lingui/react';

import type { Language } from '../../types';
import { A, Text } from '../../elements';
import { fetchLanguages } from '../../fetch';
import { fonts } from '../../style/theme';
import LanguageMenu from './LanguageMenu';

type Props = {
  // Render prop
  children?: (data: { onClick: () => void }) => Node,
  language: Language,
  linkProps?: (language: Language) => {},
  onSelectLanguage?: Language => void,
  openStateCallback?: boolean => void
};

type State = {
  showMenu: boolean,
  languages: ?Array<Language>
};

let cache = undefined;

export default class SelectLanguage extends React.Component<Props, State> {
  state = {
    showMenu: false,
    languages: cache
  };

  handleSelectLanguage = (language: Language) => {
    this.handleCloseMenu();
    this.props.onSelectLanguage && this.props.onSelectLanguage(language);
  };

  handleShowMenu = () => {
    if (!this.state.languages) {
      this.loadLanguages();
    }
    this.props.openStateCallback && this.props.openStateCallback(true);
    this.setState({ showMenu: true });
  };

  handleCloseMenu = () => {
    this.props.openStateCallback && this.props.openStateCallback(false);
    this.setState({ showMenu: false });
  };

  async loadLanguages() {
    const result = await fetchLanguages();

    if (result.isOk) {
      this.setState({ languages: result.data });
      cache = result.data;
    }
  }

  render() {
    const { language, linkProps, children } = this.props;
    const { showMenu, languages } = this.state;
    return (
      <Fragment>
        {children ? (
          children({ onClick: this.handleShowMenu })
        ) : (
          <Text>
            {language.name}{' '}
            <A onClick={this.handleShowMenu} fontWeight={fonts.weight.medium}>
              <Trans>Change</Trans>
            </A>
          </Text>
        )}
        {showMenu && (
          <LanguageMenu
            linkProps={linkProps}
            languages={languages || []}
            selectedLanguageCode={language && language.code}
            showActivityIndicator={languages == null}
            onSelectLanguage={this.handleSelectLanguage}
            onClose={this.handleCloseMenu}
          />
        )}
      </Fragment>
    );
  }
}
