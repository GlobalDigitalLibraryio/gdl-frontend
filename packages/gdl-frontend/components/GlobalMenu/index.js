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
import { getBookLanguage } from '../../lib/storage';
import { SelectLanguage } from '../LanguageMenu';
import CategoriesMenu from './CategoriesMenu';
import config from '../../config';

type Props = {|
  onClose(): void,
  isOpen: boolean
|};

type State = {
  language: Language
};

class GlobalMenu extends React.Component<Props, State> {
  state = {
    language: getBookLanguage()
  };

  render() {
    const { onClose } = this.props;

    return (
      <Drawer open={this.props.isOpen} onClose={onClose}>
        <List component="nav">
          <SelectLanguage
            language={this.state.language}
            onSelectLanguage={onClose}
            linkProps={language => ({
              route: 'books',
              params: { lang: language.code }
            })}
          >
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
          <ListItem
            button
            component="a"
            href="https://home.digitallibrary.io/about/"
          >
            <ListItemText>
              <Trans>About the Global Digital Library</Trans>
            </ListItemText>
          </ListItem>
        </List>
      </Drawer>
    );
  }
}

export default GlobalMenu;
