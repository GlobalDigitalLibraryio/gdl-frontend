// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';

import type { Language, Category } from '../../types';
import { Nav, Container } from './styledSubNavbar';
import CategoryNavigation from './CategoryNavigation';
import Breadcrumb from './Breadcrumb';
import LanguageMenu from '../LanguageMenu';
import A from '../A';

type Props = {|
  language: Language,
  crumbs?: Array<React.Node | string>,
  languages?: Array<Language>,
  category?: Category,
  showCategoryNavigation?: boolean
|};

class SubNavbar extends React.Component<Props, { showLanguageMenu: boolean }> {
  state = {
    showLanguageMenu: false
  };

  toggleShowLanguageMenu = () => {
    this.setState(state => ({ showLanguageMenu: !state.showLanguageMenu }));
  };

  render() {
    const {
      category,
      languages,
      language,
      showCategoryNavigation,
      crumbs
    } = this.props;
    return (
      <Nav>
        <Container>
          {crumbs ? (
            <Breadcrumb language={language.code} crumbs={crumbs} />
          ) : (
            showCategoryNavigation &&
            category && (
              <CategoryNavigation language={language} category={category} />
            )
          )}
          {languages && (
            <div
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {language.name}
              <A
                onClick={this.toggleShowLanguageMenu}
                isUppercased
                isBold
                style={{ paddingRight: 0 }}
              >
                Change
              </A>
            </div>
          )}
        </Container>
        {this.state.showLanguageMenu &&
          languages && (
            <LanguageMenu
              selectedLanguage={language}
              languages={languages}
              onClose={this.toggleShowLanguageMenu}
            />
          )}
      </Nav>
    );
  }
}

export default SubNavbar;
