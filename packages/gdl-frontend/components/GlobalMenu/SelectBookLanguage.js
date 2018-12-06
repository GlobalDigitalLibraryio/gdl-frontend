// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { type Node } from 'react';
import { Trans } from '@lingui/react';
import { Query } from 'react-apollo';
import { Drawer, Typography } from '@material-ui/core';
import gql from 'graphql-tag';

import type {
  languages,
  languages_languages as Language
} from '../../gqlTypes';
import LanguageList from '../LanguageList';
import { getBookLanguageCode } from '../../lib/storage';

function linkProps(language) {
  return {
    route: 'books',
    params: { lang: language.code }
  };
}

const LANGUAGES_QUERY = gql`
  query languages {
    languages {
      code
      name
    }
  }
`;

type Props = {
  anchor?: 'left' | 'right',
  children: (data: { onClick: () => void, loading: boolean }) => Node,
  onSelectLanguage?: Language => void
};

type State = {
  showMenu: boolean,
  selectedLanguage: string
};

class SelectBookLanguage extends React.Component<Props, State> {
  state = {
    showMenu: false,
    selectedLanguage: getBookLanguageCode()
  };

  componentDidUpdate() {
    // Makes sure we always show the correct language as selected when the menu is opened
    // When React Hooks arrive this will be so much nicer
    const selectedLanguage = getBookLanguageCode();
    if (this.state.selectedLanguage !== selectedLanguage) {
      this.setState({
        selectedLanguage
      });
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
    const { showMenu, selectedLanguage } = this.state;
    return (
      <Query query={LANGUAGES_QUERY} skip={!showMenu}>
        {({
          loading,
          error,
          data
        }: {
          loading: boolean,
          data: ?languages,
          error: any
        }) => (
          <>
            {children({ onClick: this.handleShowMenu, loading })}
            <Drawer
              onClose={this.handleCloseMenu}
              open={showMenu && !loading}
              anchor={anchor}
            >
              {error && (
                <Typography
                  component="span"
                  color="error"
                  css={{ margin: '1rem' }}
                >
                  <Trans>Error loading data.</Trans>
                </Typography>
              )}
              {data && data.languages && (
                <LanguageList
                  onSelectLanguage={this.handleSelectLanguage}
                  selectedLanguageCode={selectedLanguage}
                  linkProps={linkProps}
                  languages={data.languages}
                />
              )}
            </Drawer>
          </>
        )}
      </Query>
    );
  }
}

export default SelectBookLanguage;
