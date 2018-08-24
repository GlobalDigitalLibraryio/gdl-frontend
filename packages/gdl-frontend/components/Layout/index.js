// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React, { type Node } from 'react';
import styled from 'react-emotion';
import { MuiThemeProvider } from '@material-ui/core/styles';

import type { Category } from '../../types';
import Navbar from '../Navbar';
import GlobalMenu from '../GlobalMenu';
import Main from './Main';
import Footer from './Footer';
import { classRoomTheme } from '../../getPageContext';

// Use height instead of min-height to fix flexbox issue in IE (https://philipwalton.com/articles/normalizing-cross-browser-flexbox-bugs/)
const PageWrapper = styled('div')`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

type Props = {|
  children: Node,
  category?: ?Category,
  wrapWithMain: boolean
|};

type State = {
  drawerIsOpen: boolean
};

class Layout extends React.Component<Props, State> {
  static defaultProps = {
    wrapWithMain: true
  };

  state = {
    drawerIsOpen: false
  };

  wrapWithCategoryTheme(node: Node) {
    if (this.props.category === 'classroom_books') {
      return <MuiThemeProvider theme={classRoomTheme}>{node}</MuiThemeProvider>;
    }
    return node;
  }

  render() {
    const { children, wrapWithMain } = this.props;
    return this.wrapWithCategoryTheme(
      <PageWrapper>
        <Navbar onMenuClick={() => this.setState({ drawerIsOpen: true })} />
        <GlobalMenu
          onClose={() => this.setState({ drawerIsOpen: false })}
          isOpen={this.state.drawerIsOpen}
        />
        {wrapWithMain ? <Main>{children}</Main> : children}
        <Footer />
      </PageWrapper>
    );
  }
}

export default Layout;
