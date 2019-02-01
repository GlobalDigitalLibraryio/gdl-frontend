// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React, { type Node } from 'react';
import styled from '@emotion/styled';

import Navbar from '../Navbar';
import GlobalMenu from '../GlobalMenu';
import Main from './Main';
import Footer from './Footer';

// Use height instead of min-height to fix flexbox issue in IE (https://philipwalton.com/articles/normalizing-cross-browser-flexbox-bugs/)
// Top padding for fixed appbar/nav
// The padding here is copied from MUIs toolbar. Copied for convenience, so will probably break in the future
// https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/styles/createMixins.js
const PageWrapper = styled('div')`
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 56px;
  @media (min-width: 0px) and (orientation: landscape) {
    padding-top: 48px;
  }
  @media (min-width: 600px) {
    padding-top: 64px;
  }
`;

type Props = {|
  children: Node,
  wrapWithMain: boolean,
  containerBackground?: 'white' | 'gray'
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

  render() {
    const { children, wrapWithMain, containerBackground } = this.props;
    return (
      <PageWrapper>
        <Navbar onMenuClick={() => this.setState({ drawerIsOpen: true })} />
        <GlobalMenu
          onClose={() => this.setState({ drawerIsOpen: false })}
          isOpen={this.state.drawerIsOpen}
        />
        {wrapWithMain ? (
          <Main background={containerBackground}>{children}</Main>
        ) : (
          children
        )}
        <Footer />
      </PageWrapper>
    );
  }
}

export default Layout;
