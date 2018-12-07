// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { type Node } from 'react';
import { Trans } from '@lingui/react';
import { Drawer, Typography } from '@material-ui/core';

import type { Language } from '../../types';
import { fetchLanguages } from '../../fetch';
import LanguageList from '../LanguageList';
import { getBookLanguageCode } from '../../lib/storage';

type Props = {
  anchor?: 'left' | 'right',
  children: (data: { onClick: () => void, loading: boolean }) => Node,
  onSelectLanguage?: Language => void
};

type State = {
  showMenu: boolean,
  languages: ?'LOADING' | 'ERROR' | Array<Language>,
  selectedLanguage: string
};

function linkProps(language) {
  return {
    route: 'books',
    params: { lang: language.code }
  };
}

/**
 * We cache the results of the successful API call, since this doesn't really change
 */
let cache = undefined;

export default class SelectBookLanguage extends React.Component<Props, State> {
  state = {
    showMenu: false,
    languages: cache,
    selectedLanguage: getBookLanguageCode()
  };

  /**
   * We only load the book languages if the menu is "open" and we're in an uninitialized state
   */
  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.showMenu && this.state.languages == null) {
      this.loadLanguages();
    }

    // Makes sure we always show the correct language as selected when the menu is opened
    // When React Hooks arrive this will be so much nicer
    const selectedLanguage = getBookLanguageCode();
    if (this.state.selectedLanguage !== selectedLanguage) {
      this.setState({
        selectedLanguage
      });
    }
  }

  async loadLanguages() {
    this.setState({ languages: 'LOADING' });
    const result = await fetchLanguages();

    if (result.isOk) {
      this.setState({
        languages: result.data
      });
      cache = result.data;
    } else {
      this.setState({ languages: 'ERROR' });
    }
  }

  handleSelectLanguage = (language: Language) => {
    this.handleCloseMenu();
    this.props.onSelectLanguage && this.props.onSelectLanguage(language);
  };

  handleShowMenu = () => this.setState({ showMenu: true });

  handleCloseMenu = () => this.setState({ showMenu: false });

  render() {
    const { children, anchor } = this.props;
    const { showMenu, languages, selectedLanguage } = this.state;
    return (
      <>
        {children({
          onClick: this.handleShowMenu,
          loading: languages === 'LOADING'
        })}
        <Drawer
          onClose={this.handleCloseMenu}
          open={showMenu && !!languages && languages !== 'LOADING'}
          anchor={anchor}
        >
          {languages === 'ERROR' && (
            <Typography component="span" color="error" css={{ margin: '1rem' }}>
              <Trans>Error loading data.</Trans>
            </Typography>
          )}
          {Array.isArray(languages) && (
            <LanguageList
              onSelectLanguage={this.handleSelectLanguage}
              selectedLanguageCode={selectedLanguage}
              linkProps={linkProps}
              languages={languages}
            />
          )}
        </Drawer>
      </>
    );
  }
}
