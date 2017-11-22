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
import media from './helpers/media';
import Navbar from './Navbar';
import Breadcrumb from './Breadcrumb';
import Container from './Container';
import Sidemenu from './Sidemenu';
import theme from '../style/theme';

const Toolbar = styled.div`
  background: ${theme.colors.white};
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  position: relative;
  font-size: 12px;
  height: 28px;
  ${media.tablet`
    font-size: 14px;
    height: 38px;
  `} ${Container} {
    display: flex;
    height: 100%;
  }
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
      <div>
        <Navbar
          lang={language.code}
          onMenuClick={() => this.setState({ menuIsExpanded: true })}
          menuIsExpanded={this.state.menuIsExpanded}
        />
        <Toolbar>
          <Container mw="1075px">
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
        {children}
      </div>
    );
  }
}

export default Layout;
