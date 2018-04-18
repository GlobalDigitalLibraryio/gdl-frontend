// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { Fragment } from 'react';
import { Trans } from '@lingui/react';

import type { Language } from '../../../types';
import { A, Text } from '../../../elements';
import { fetchLanguages } from '../../../fetch';
import { fonts } from '../../../style/theme';
import LanguageMenu from '../../../components/TranslationLanguageMenu';

type Props = {
  language: Language,
  onSelectLanguage: Language => void
};

type State = {
  showMenu: boolean,
  languages: ?Array<Language>
};

export default class SelectLanguage extends React.Component<Props, State> {
  state = {
    showMenu: false,
    languages: null
  };

  handleSelectLanguage = (language: Language) => {
    this.setState({ showMenu: false });
    this.props.onSelectLanguage(language);
  };

  handleShowMenu = () => {
    if (!this.state.languages) {
      this.loadLanguages();
    }

    this.setState({ showMenu: true });
  };

  async loadLanguages() {
    const result = await fetchLanguages();

    if (result.isOk) {
      this.setState({ languages: result.data });
    }
  }

  render() {
    const { language } = this.props;
    const { showMenu, languages } = this.state;
    return (
      <Fragment>
        <Text>
          {language.name}{' '}
          <A onClick={this.handleShowMenu} fontWeight={fonts.weight.medium}>
            <Trans>Change</Trans>
          </A>
        </Text>
        {showMenu &&
          languages && (
            <LanguageMenu
              languages={languages}
              selectedLanguageCode={language && language.code}
              onSelectLanguage={this.handleSelectLanguage}
              onClose={() => this.setState({ showMenu: false })}
            />
          )}
      </Fragment>
    );
  }
}
