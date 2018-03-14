// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';

import type { Language, CategoryType } from '../../types';
import { Nav, Container } from './styledSubNavbar';
import CategoryNavigation from './CategoryNavigation';
import Breadcrumb from './Breadcrumb';
import LanguageMenu from '../LanguageMenu';
import A from '../A';

type Props = {
  toolbarEnd?: React.Node,
  language: Language,
  crumbs?: Array<React.Node | string>,
  languages?: Array<Language>,
  categoryType: CategoryType
};

class SubNavbar extends React.Component<Props, { showLanguageMenu: boolean }> {
  state = {
    showLanguageMenu: false
  };

  toggleShowLanguageMenu = () => {
    this.setState(state => ({ showLanguageMenu: !state.showLanguageMenu }));
  };

  render() {
    const { categoryType, languages, language, crumbs } = this.props;
    return (
      <Nav>
        <Container>
          {crumbs ? (
            <Breadcrumb language={language.code} crumbs={crumbs} />
          ) : (
            <CategoryNavigation categoryType={categoryType} />
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
