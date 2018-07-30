// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { Fragment, type Node } from 'react';

import type { Language } from '../../types';
import { fetchLanguages } from '../../fetch';
import LanguageMenu from './LanguageMenu';
import { getBookLanguageCode } from '../../lib/storage';

type Props = {
  anchor?: 'left' | 'right',
  // Render prop
  children: (data: { onClick: () => void }) => Node,
  onSelectLanguage?: Language => void
};

type State = {
  showMenu: boolean,
  languages: ?Array<Language>,
  language: string
};

let cache = undefined;

function linkProps(language) {
  return {
    route: 'books',
    params: { lang: language.code }
  };
}

export default class SelectLanguage extends React.Component<Props, State> {
  state = {
    showMenu: false,
    languages: cache,
    language: getBookLanguageCode()
  };

  // We only hit the network to get the languages if we really need to
  componentDidUpdate(prevProps: Props, prevState: State) {
    // Makes sure we always show the correct language as selected when the menu is opened
    if (!prevState.showMenu && this.state.showMenu) {
      const language = getBookLanguageCode();
      if (language !== prevState.language) {
        this.setState({ language });
      }
    }

    if (
      !prevState.showMenu &&
      this.state.showMenu &&
      this.state.languages == null
    ) {
      this.loadLanguages();
    }
  }

  handleSelectLanguage = (language: Language) => {
    this.handleCloseMenu();
    this.props.onSelectLanguage && this.props.onSelectLanguage(language);
  };

  handleShowMenu = () => this.setState({ showMenu: true });

  handleCloseMenu = () => this.setState({ showMenu: false });

  async loadLanguages() {
    const result = await fetchLanguages();

    if (result.isOk) {
      this.setState({ languages: result.data });
      cache = result.data;
    }
  }

  render() {
    const { children, anchor } = this.props;
    const { showMenu, languages, language } = this.state;
    return (
      <Fragment>
        {children({ onClick: this.handleShowMenu })}
        {showMenu && (
          <LanguageMenu
            anchor={anchor}
            linkProps={linkProps}
            languages={languages || []}
            selectedLanguageCode={language}
            showActivityIndicator={languages == null}
            onSelectLanguage={this.handleSelectLanguage}
            onClose={this.handleCloseMenu}
          />
        )}
      </Fragment>
    );
  }
}
