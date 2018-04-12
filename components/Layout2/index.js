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
import type { Category } from '../../types';
import Navbar from '../Navbar';
import GlobalMenu from '../GlobalMenu';
import { misc, colors } from '../../style/theme';
import { LanguageCategory } from '../LanguageCategoryContext';

const ContentWrapper = styled('main')`
  box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.2);
  background: ${colors.container.background};
  flex: 1;
  width: 100%;
  max-width: ${misc.containers.large};
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
  crumbs?: Array<React.Node | string>,
  category: ?Category,
  languageCode: string
|};

const Layout = ({ children, languageCode, category }: Props) => (
  <ThemeProvider
    theme={{
      category: category === 'classroom_books' ? 'classroom' : 'library'
    }}
  >
    <LanguageCategory category={undefined} languageCode={languageCode}>
      <PageWrapper>
        <PortalWithState>
          {({ portal, closePortal, openPortal, isOpen }) => (
            <React.Fragment>
              <nav>
                <Navbar onMenuClick={openPortal} menuIsExpanded={isOpen} />
              </nav>
              {portal(
                <GlobalMenu onClose={closePortal} languageCode={languageCode} />
              )}
            </React.Fragment>
          )}
        </PortalWithState>
        <ContentWrapper>{children}</ContentWrapper>
      </PageWrapper>
    </LanguageCategory>
  </ThemeProvider>
);

export default Layout;
