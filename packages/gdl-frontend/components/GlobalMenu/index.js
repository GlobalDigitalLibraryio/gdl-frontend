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
import CCLogo from './cc-logo.svg';

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

  // Makes sure we always show the correct language as selected when the menu is opened
  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!prevProps.isOpen && this.props.isOpen) {
      const language = getBookLanguage();
      if (language !== prevState.language) {
        this.setState({ language });
      }
    }
  }

  render() {
    const { onClose } = this.props;

    return (
      <Drawer open={this.props.isOpen} onClose={onClose}>
        <List>
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
          <ListItemA href="https://home.digitallibrary.io/about/">
            <Trans>About the Global Digital Library</Trans>
          </ListItemA>
          <ListItemA href="https://home.digitallibrary.io/the-global-digital-library-uses-cookies/">
            <Trans>Cookie policy</Trans>
          </ListItemA>
          <ListItemA href="https://home.digitallibrary.io/privacy/">
            <Trans>Privacy policy</Trans>
          </ListItemA>
          <ListItemA href={config.zendeskUrl}>
            <Trans>Report issues</Trans>
          </ListItemA>
          <ListItemA href="https://blog.digitallibrary.io/cc/">
            <Trans>Licensing and reuse</Trans>
          </ListItemA>
          <ListItem
            href="https://creativecommons.org/"
            component="a"
            aria-label="Creative Commons"
          >
            <CCLogo css={{ width: '100px' }} />
          </ListItem>
        </List>
      </Drawer>
    );
  }
}

const ListItemA = ({ href, ...props }) => (
  <ListItem component="a" href={href} button>
    <ListItemText {...props} />
  </ListItem>
);

export default GlobalMenu;
