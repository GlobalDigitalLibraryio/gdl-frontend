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
import LanguageCategoryContext from '../LanguageCategoryContext';
import Breadcrumb from './Breadcrumb';
import LanguageMenu from '../LanguageMenu';
import A from '../A';

type Props = {|
  language: Language,
  crumbs?: Array<React.Node | string>,
  languages?: Array<Language>,
  categories?: Array<Category>
|};

class SubNavbar extends React.Component<Props, { showLanguageMenu: boolean }> {
  state = {
    showLanguageMenu: false
  };

  toggleShowLanguageMenu = () => {
    this.setState(state => ({ showLanguageMenu: !state.showLanguageMenu }));
  };

  render() {
    const { languages, language, categories, crumbs } = this.props;
    return (
      <Nav>
        <Container>
          {crumbs ? (
            <Breadcrumb crumbs={crumbs} />
          ) : (
            categories && (
              <CategoryNavigation language={language} categories={categories} />
            )
          )}
          {languages && (
            <LanguageCategoryContext.Consumer>
              {({ language }) => (
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
            </LanguageCategoryContext.Consumer>
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
