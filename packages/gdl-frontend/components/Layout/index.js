// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React, { type Node } from 'react';
import styled from 'react-emotion';
import { ThemeProvider } from 'emotion-theming';
import { Paper } from '@material-ui/core';

import type { Category } from '../../types';
import Navbar from '../Navbar';
import GlobalMenu from '../GlobalMenu';
import { misc, colors } from '../../style/theme';
import { NavContextBar, Breadcrumb } from '../NavContextBar';

const Main = styled(Paper)`
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

class Layout extends React.Component<Props, { drawerIsOpen: boolean }> {
  static defaultProps = {
    wrapWithMain: true
  };

  state = {
    drawerIsOpen: false
  };

  render() {
    const { children, category, wrapWithMain, crumbs } = this.props;
    return (
      <ThemeProvider
        theme={{
          category: category === 'classroom_books' ? 'classroom' : 'library'
        }}
      >
        <PageWrapper>
          <Navbar onMenuClick={() => this.setState({ drawerIsOpen: true })} />
          <GlobalMenu
            onClose={() => this.setState({ drawerIsOpen: false })}
            isOpen={this.state.drawerIsOpen}
          />
          {crumbs && (
            <NavContextBar>
              <Breadcrumb crumbs={crumbs} />
            </NavContextBar>
          )}
          {wrapWithMain ? <Main component="main">{children}</Main> : children}
        </PageWrapper>
      </ThemeProvider>
    );
  }
}

export default Layout;
export { Main };
