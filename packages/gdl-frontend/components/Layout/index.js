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
import { NavContextBar, Breadcrumb } from '../NavContextBar';

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
  category?: ?Category,
  crumbs?: Array<Node | string>,
  wrapWithMain: boolean
|};

const Layout = ({ children, category, wrapWithMain, crumbs }: Props) => {
  return (
    <ThemeProvider
      theme={{
        category: category === 'classroom_books' ? 'classroom' : 'library'
      }}
    >
      <PageWrapper>
        <PortalWithState>
          {({ portal, closePortal, openPortal, isOpen }) => (
            <Fragment>
              <Navbar onMenuClick={openPortal} menuIsExpanded={isOpen} />
              <GlobalMenu onClose={closePortal} isOpen={isOpen} />
            </Fragment>
          )}
        </PortalWithState>
        {crumbs && (
          <NavContextBar>
            <Breadcrumb crumbs={crumbs} />
          </NavContextBar>
        )}
        {wrapWithMain ? <Main>{children}</Main> : children}
      </PageWrapper>
    </ThemeProvider>
  );
};

Layout.defaultProps = {
  wrapWithMain: true
};

export default Layout;
export { Main };
