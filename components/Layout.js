// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'styled-components';
import type { Language } from '../types';
import media from '../style/media';
import Navbar from './Navbar';
import Breadcrumb from './Breadcrumb';
import Container from './Container';
import Sidemenu from './Sidemenu';
import theme from '../style/theme';

const Toolbar = styled.div`
  background: ${theme.colors.white};
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  position: relative;
  font-size: 13px;
  height: 28px;
  z-index: 10;
  ${media.tablet`
    font-size: 16px;
    height: 38px;
  `} ${Container} {
    display: flex;
    height: 100%;
  }
`;

const Content = styled('div')`
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  background: ${theme.colors.grayLighter};
  flex: 1;
  width: 100%;
  max-width: ${theme.containers.large};
  margin-left: auto;
  margin-right: auto;
`;

type Props = {
  children: React.Node,
  toolbarEnd?: React.Node,
  currentPage?: string,
  language: Language,
};

type State = {
  menuIsExpanded: boolean,
};

class Layout extends React.Component<Props, State> {
  state = {
    menuIsExpanded: false,
  };

  render() {
    const { children, toolbarEnd, language, currentPage } = this.props;
    return (
      <div
        column
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <Navbar
          lang={language.code}
          onMenuClick={() => this.setState({ menuIsExpanded: true })}
          menuIsExpanded={this.state.menuIsExpanded}
        />
        <Toolbar>
          <Container size="large">
            <Breadcrumb language={language} currentPage={currentPage} />
            {toolbarEnd}
          </Container>
        </Toolbar>
        {this.state.menuIsExpanded && (
          <Sidemenu
            id="sidenav"
            onCloseRequested={() => this.setState({ menuIsExpanded: false })}
            language={language}
          />
        )}
        <Content>{children}</Content>
      </div>
    );
  }
}

export default Layout;
