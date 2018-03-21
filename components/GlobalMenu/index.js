// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { Fragment } from 'react';
import { withRouter } from 'next/router';
import { Trans } from '@lingui/react';
import Link from 'next/link';

import config from '../../config';
import type { Language, ReadingLevel } from '../../types';
import { fetchLanguages, fetchCategories } from '../../fetch';
import { Link as RouteLink } from '../../routes';
import { getAuthToken } from '../../lib/auth/token';
import Menu, { MenuItem } from '../Menu';
import CreativeCommonsLogo from './cc-logo.svg';
import LanguageMenu from '../LanguageMenu';
import CategoriesMenu from './CategoriesMenu';

type Props = {|
  onClose(): void,
  language: Language,
  router: any
|};

export type Categories = {
  classroom_books?: Array<ReadingLevel>,
  library_books?: Array<ReadingLevel>
};

type State = {
  languages: Array<Language>,
  categories: Categories,
  showLanguageMenu: boolean,
  showCategoriesMenu: boolean
};

type Cache = {|
  languages: Array<Language>,
  categories: Categories,
  language: ?Language
|};

const stateCache: Cache = {
  languages: [],
  categories: {},
  language: null
};

class GlobalMenu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    if (
      stateCache.language &&
      stateCache.language.code === props.language.code
    ) {
      this.state = {
        languages: stateCache.languages,
        categories: stateCache.categories,
        showLanguageMenu: false,
        showCategoriesMenu: false
      };
    } else {
      this.state = {
        languages: [],
        categories: {},
        showLanguageMenu: false,
        showCategoriesMenu: false
      };
    }
  }

  componentDidMount() {
    // Only fetch if we haven't already set stuff from the cache in the constructor
    if (this.state.languages.length === 0) {
      this.getMenuData();
    }
    // Remember the last language we mounted with in the cache
    stateCache.language = this.props.language;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.router !== nextProps.router) {
      nextProps.onClose();
    }
  }

  /**
   * When unmounting, we keep the langauge and level results so we won't have to refetch it on a different page if the langauge is the same
   */
  componentWillUnmount() {
    stateCache.languages = this.state.languages;
    stateCache.categories = this.state.categories;
  }

  getMenuData = async () => {
    const [languages, categories] = await Promise.all([
      fetchLanguages()(),
      fetchCategories(this.props.language.code)()
    ]);

    this.setState({
      categories,
      languages
    });
  };

  toggleShowLanguageMenu = () =>
    this.setState(state => ({ showLanguageMenu: !state.showLanguageMenu }));

  toggleShowCategoriesMenu = () =>
    this.setState(state => ({ showCategoriesMenu: !state.showCategoriesMenu }));

  render() {
    const { language, onClose } = this.props;

    return (
      <Fragment>
        {this.state.showLanguageMenu && (
          <LanguageMenu
            isNestedMenu
            selectedLanguage={language}
            languages={this.state.languages}
            onClose={this.toggleShowLanguageMenu}
          />
        )}
        {this.state.showCategoriesMenu && (
          <CategoriesMenu
            language={language}
            categories={this.state.categories}
            onClose={this.toggleShowCategoriesMenu}
          />
        )}
        <Menu
          heading={<Trans>Menu</Trans>}
          onClose={onClose}
          hasOpenNestedMenu={
            this.state.showCategoriesMenu || this.state.showLanguageMenu
          }
        >
          <MenuItem
            showKeyLine
            hasNestedMenu
            onClick={this.toggleShowLanguageMenu}
          >
            <Trans>Book language</Trans>
          </MenuItem>
          <MenuItem
            showKeyLine
            hasNestedMenu
            onClick={this.toggleShowCategoriesMenu}
          >
            <Trans>Categories</Trans>
          </MenuItem>

          <MenuItem href="https://home.digitallibrary.io/about/">
            <Trans>About Global Digital Library</Trans>
          </MenuItem>

          {config.TRANSLATION_PAGES && (
            <Fragment>
              <RouteLink passHref route="translations">
                <MenuItem>
                  <Trans>My translations</Trans>
                </MenuItem>
              </RouteLink>
              {getAuthToken() != null && (
                <Link passHref href="/auth/sign-off">
                  <MenuItem>
                    <Trans>Log out</Trans>
                  </MenuItem>
                </Link>
              )}
            </Fragment>
          )}
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
export default withRouter(GlobalMenu);
