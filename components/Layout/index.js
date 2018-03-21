// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'react-emotion';
import { ThemeProvider } from 'emotion-theming';
import { PortalWithState } from 'react-portal';
import type { Language, Category } from '../../types';
import Navbar from '../Navbar';
import SubNavbar from '../SubNavbar';
import GlobalMenu from '../GlobalMenu';
import theme from '../../style/theme';
import LanguageCategoryContext from '../LanguageCategoryContext';

const ContentWrapper = styled('main')`
  box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.2);
  background: ${theme.colors.whiteTer};
  flex: 1;
  width: 100%;
  max-width: ${theme.containers.large};
  margin-left: auto;
  margin-right: auto;
`;

const PageWrapper = styled('div')`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

type Props = {|
  children: React.Node,
  languages?: Array<Language>,
  crumbs?: Array<React.Node | string>,
  categories?: Array<Category>
|};

const Layout = ({ children, languages, categories, crumbs }: Props) => (
  <LanguageCategoryContext.Consumer>
    {({ category, language }) => (
      <ThemeProvider
        theme={{
          category: category === 'classroom_books' ? 'classroom' : 'library'
        }}
      >
        <PageWrapper>
          <PortalWithState>
            {({ portal, closePortal, openPortal, isOpen }) => (
              <React.Fragment>
                <nav>
                  <Navbar onMenuClick={openPortal} menuIsExpanded={isOpen} />
                  {(crumbs || languages || categories) && (
                    <SubNavbar
                      language={language}
                      categories={categories}
                      crumbs={crumbs}
                      languages={languages}
                    />
                  )}
                </nav>
                {portal(
                  <GlobalMenu onClose={closePortal} language={language} />
                )}
              </React.Fragment>
            )}
          </PortalWithState>
          <ContentWrapper>{children}</ContentWrapper>
        </PageWrapper>
      </ThemeProvider>
    )}
  </LanguageCategoryContext.Consumer>
);

export default Layout;
