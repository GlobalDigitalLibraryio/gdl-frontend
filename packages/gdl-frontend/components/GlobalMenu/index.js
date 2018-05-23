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
import MdKeyboardArrowRight from 'react-icons/lib/md/keyboard-arrow-right';

import config from '../../config';
import type { Language } from '../../types';
import { Link as RouteLink } from '../../routes';
import { getTokenFromLocalCookie } from '../../lib/auth/token';
import { getBookLanguage } from '../../lib/storage';
import CreativeCommonsLogo from './cc-logo.svg';
import { SelectLanguage } from '../LanguageMenu';
import CategoriesMenu from './CategoriesMenu';

type Props = {|
  onClose(): void
|};

type State = {
  language: Language,
  hasOpenNestedMenu: boolean
};

class GlobalMenu extends React.Component<Props, State> {
  state = {
    language: getBookLanguage(),
    hasOpenNestedMenu: false
  };

  nestedMenuOpenState = (isOpen: boolean) =>
    this.setState({ hasOpenNestedMenu: isOpen });

  render() {
    const { onClose } = this.props;

    return (
      <Drawer open={this.props.isOpen} onClose={onClose}>
        <List component="nav">
          <SelectLanguage
            openStateCallback={this.nestedMenuOpenState}
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
                <MdKeyboardArrowRight />
              </ListItem>
            )}
          </SelectLanguage>
          <CategoriesMenu
            openStateCallback={this.nestedMenuOpenState}
            onSelectCategory={onClose}
            languageCode={this.state.language.code}
          >
            {({ onClick }) => (
              <ListItem button onClick={onClick}>
                <ListItemText>
                  <Trans>Categories</Trans>
                </ListItemText>
                <MdKeyboardArrowRight />
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
          <ListItem
            button
            component="a"
            href="https://blog.digitallibrary.io/cc/"
          >
            <ListItemText>
              <Trans>Licensing and reuse</Trans>
            </ListItemText>
          </ListItem>
          <ListItem
            button
            component="a"
            href="https://home.digitallibrary.io/the-global-digital-library-uses-cookies/"
          >
            <ListItemText>
              <Trans>Cookie policy</Trans>
            </ListItemText>
          </ListItem>
          <ListItem
            button
            component="a"
            href="https://home.digitallibrary.io/privacy/"
          >
            <ListItemText>
              <Trans>Privacy policy</Trans>
            </ListItemText>
          </ListItem>
          <ListItem button component="a" href={config.zendeskUrl}>
            <ListItemText>
              <Trans>Report issues</Trans>
            </ListItemText>
          </ListItem>
          <ListItem>
            <CreativeCommonsLogo
              aria-label="Creative Commons"
              style={{ width: '25%' }}
            />
          </ListItem>
        </List>
      </Drawer>
    );
  }
}

export default GlobalMenu;
