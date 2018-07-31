// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { Fragment } from 'react';
import { Trans } from '@lingui/react';
import Link from 'next/link';
import {
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';
import { KeyboardArrowRight as KeyboardArrowRightIcon } from '@material-ui/icons';

import type { Language } from '../../types';
import { Link as RouteLink } from '../../routes';
import { getTokenFromLocalCookie } from '../../lib/auth/token';
import { hasClaim, claims } from 'gdl-auth';
import { getBookLanguage } from '../../lib/storage';
import { SelectLanguage } from '../LanguageMenu';
import CategoriesMenu from './CategoriesMenu';
import config from '../../config';

type Props = {|
  onClose(): void,
  isOpen: boolean
|};

type State = {
  language: Language,
  userHasAdminPrivileges: boolean
};

class GlobalMenu extends React.Component<Props, State> {
  state = {
    language: getBookLanguage(),
    userHasAdminPrivileges: false
  };

  // Makes sure we always show the correct language as selected when the menu is opened
  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!prevProps.isOpen && this.props.isOpen) {
      const language = getBookLanguage();
      if (language !== prevState.language) {
        this.setState({ language });
      }
    }
  }

  componentDidMount() {
    this.setState({ userHasAdminPrivileges: hasClaim(claims.readAdmin) });
  }

  render() {
    const { onClose } = this.props;

    return (
      <Drawer open={this.props.isOpen} onClose={onClose}>
        <List>
          <SelectLanguage onSelectLanguage={onClose}>
            {({ onClick }) => (
              <ListItem button onClick={onClick}>
                <ListItemText>
                  <Trans>Book language</Trans>
                </ListItemText>
                <KeyboardArrowRightIcon />
              </ListItem>
            )}
          </SelectLanguage>
          <CategoriesMenu
            onSelectCategory={onClose}
            languageCode={this.state.language.code}
          >
            {({ onClick }) => (
              <ListItem button onClick={onClick}>
                <ListItemText>
                  <Trans>Categories</Trans>
                </ListItemText>
                <KeyboardArrowRightIcon />
              </ListItem>
            )}
          </CategoriesMenu>
          <Divider />
          {this.state.userHasAdminPrivileges && (
            <ListItem component="a" href="/admin" button>
              <ListItemText>
                <Trans>GDL Admin</Trans>
              </ListItemText>
            </ListItem>
          )}
          {config.TRANSLATION_PAGES && (
            <Fragment>
              {getTokenFromLocalCookie() == null ? (
                <Link passHref href="/auth/sign-in">
                  <ListItem button component="a">
                    <ListItemText>
                      <Trans>Log in</Trans>
                    </ListItemText>
                  </ListItem>
                </Link>
              ) : (
                <Link passHref href="/auth/sign-off">
                  <ListItem button component="a">
                    <ListItemText>
                      <Trans>Log out</Trans>
                    </ListItemText>
                  </ListItem>
                </Link>
              )}
              <RouteLink passHref route="translations">
                <ListItem button component="a">
                  <ListItemText>
                    <Trans>My translations</Trans>
                  </ListItemText>
                </ListItem>
              </RouteLink>
            </Fragment>
          )}
        </List>
      </Drawer>
    );
  }
}

export default GlobalMenu;
