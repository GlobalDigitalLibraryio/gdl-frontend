// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React, { Fragment, type Node } from 'react';
import styled from 'react-emotion';
import { ThemeProvider } from 'emotion-theming';
import { PortalWithState } from 'react-portal';
import type { Category } from '../../types';
import Navbar from '../Navbar';
import GlobalMenu from '../GlobalMenu';
import { misc, colors } from '../../style/theme';
import { LanguageCategory } from '../LanguageCategoryContext';
import { NavContextBar } from '../NavContextBar';

const Main = styled('main')`
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
  children: Node,
  crumbs?: Array<Node | string>,
  category: ?Category,
  languageCode: string,
  renderContextNavbar: ?() => Node
|};

const Layout = ({
  children,
  languageCode,
  category,
  renderContextNavbar
}: Props) => {
  return (
    <ThemeProvider
      theme={{
        category: category === 'classroom_books' ? 'classroom' : 'library'
      }}
    >
      <LanguageCategory category={undefined} languageCode={languageCode}>
        <PageWrapper>
          <PortalWithState>
            {({ portal, closePortal, openPortal, isOpen }) => (
              <Fragment>
                <Navbar onMenuClick={openPortal} menuIsExpanded={isOpen} />
                {portal(
                  <GlobalMenu
                    onClose={closePortal}
                    languageCode={languageCode}
                  />
                )}
              </Fragment>
            )}
          </PortalWithState>
          {/* renderContextNavbar && (
            <NavContextBar>{renderContextNavbar()}</NavContextBar>
          )}
        <Main>{children}</Main> */}
          {children}
        </PageWrapper>
      </LanguageCategory>
    </ThemeProvider>
  );
};

export default Layout;
export { Main };
