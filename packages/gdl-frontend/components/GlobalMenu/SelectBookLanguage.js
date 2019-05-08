// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import React, { type Node } from 'react';
import { FormattedMessage } from 'react-intl';
import { SwipeableDrawer, Typography } from '@material-ui/core';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import type { languages_languages as Language } from '../../gqlTypes';
import LanguageList from '../LanguageList';
import { getBookLanguageCode } from '../../lib/storage';
import { GdlI18nConsumer } from '../GdlI18nProvider';

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
  onSelectLanguage?: Language => void,
  enableParentSwipe?: () => void,
  disableParentSwipe?: () => void
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

  handleShowMenu = () => {
    this.setState({ showMenu: true });
    this.props.disableParentSwipe && this.props.disableParentSwipe();
  };

  handleCloseMenu = () => {
    this.setState({ showMenu: false });
    this.props.enableParentSwipe && this.props.enableParentSwipe();
  };

  render() {
    const { children, anchor } = this.props;
    const { showMenu, selectedLanguage } = this.state;

    return (
      <Query query={LANGUAGES_QUERY} skip={!showMenu}>
        {({
          loading,
          error,
          data,
          networkStatus
        }: {
          loading: boolean,
          data: any,
          error: any,
          networkStatus: number
        }) => {
          const isLoading = Boolean(data) && !('languages' in data) && loading;

          return (
            <>
              {children({
                onClick: this.handleShowMenu,
                loading: isLoading
              })}
              <SwipeableDrawer
                disableDiscovery
                disableSwipeToOpen
                disableBackdropTransition
                onClose={this.handleCloseMenu}
                onOpen={() => {}}
                open={showMenu && !isLoading}
                anchor={anchor}
              >
                {error && (
                  <Typography
                    component="span"
                    color="error"
                    css={{ margin: '1rem' }}
                  >
                    <FormattedMessage
                      id="Error loading data"
                      defaultMessage="Error loading data."
                    />
                  </Typography>
                )}
                {!isLoading && data && (
                  <GdlI18nConsumer>
                    {value => (
                      <LanguageList
                        onSelectLanguage={language => {
                          this.handleSelectLanguage(language);
                          value && value.changeSiteLanguage(language);
                        }}
                        selectedLanguageCode={selectedLanguage}
                        linkProps={linkProps}
                        languages={data.languages}
                      />
                    )}
                  </GdlI18nConsumer>
                )}
              </SwipeableDrawer>
            </>
          );
        }}
      </Query>
    );
  }
}

export default SelectBookLanguage;
