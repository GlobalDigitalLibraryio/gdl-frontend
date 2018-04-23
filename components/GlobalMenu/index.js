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

import config from '../../config';
import type { Language } from '../../types';
import { Link as RouteLink } from '../../routes';
import { getTokenFromLocalCookie } from '../../lib/auth/token';
import { getBookLanguage } from '../../lib/storage';
import Menu, { MenuItem } from '../Menu';
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
      <Fragment>
        <Menu
          heading={<Trans>Menu</Trans>}
          onClose={onClose}
          hasOpenNestedMenu={this.state.hasOpenNestedMenu}
        >
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
              <MenuItem onClick={onClick} showKeyLine hasNestedMenu>
                <Trans>Book language</Trans>
              </MenuItem>
            )}
          </SelectLanguage>
          <CategoriesMenu
            openStateCallback={this.nestedMenuOpenState}
            onSelectCategory={onClose}
            languageCode={this.state.language.code}
          >
            {({ onClick }) => (
              <MenuItem onClick={onClick} showKeyLine hasNestedMenu>
                <Trans>Categories</Trans>
              </MenuItem>
            )}
          </CategoriesMenu>
          {config.TRANSLATION_PAGES && (
            <Fragment>
              {getTokenFromLocalCookie() == null ? (
                <Link passHref href="/auth/sign-in">
                  <MenuItem>
                    <Trans>Log in</Trans>
                  </MenuItem>
                </Link>
              ) : (
                <Link passHref href="/auth/sign-off">
                  <MenuItem>
                    <Trans>Log out</Trans>
                  </MenuItem>
                </Link>
              )}
              <RouteLink passHref route="translations">
                <MenuItem>
                  <Trans>My translations</Trans>
                </MenuItem>
              </RouteLink>
            </Fragment>
          )}

          <MenuItem href="https://home.digitallibrary.io/about/">
            <Trans>About the Global Digital Library</Trans>
          </MenuItem>
          <MenuItem href="https://blog.digitallibrary.io/cc/">
            <Trans>Licensing and reuse</Trans>
          </MenuItem>
          <MenuItem href="https://home.digitallibrary.io/the-global-digital-library-uses-cookies/">
            <Trans>Cookie policy</Trans>
          </MenuItem>
          <MenuItem href="https://home.digitallibrary.io/privacy/">
            <Trans>Privacy policy</Trans>
          </MenuItem>
          <MenuItem href={config.zendeskUrl}>
            <Trans>Report issues</Trans>
          </MenuItem>
          <MenuItem>
            <CreativeCommonsLogo
              aria-label="Creative Commons"
              style={{ width: '25%' }}
            />
          </MenuItem>
        </Menu>
      </Fragment>
    );
  }
}

export default GlobalMenu;
