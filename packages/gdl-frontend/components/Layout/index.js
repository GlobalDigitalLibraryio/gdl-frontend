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
import { Paper, CardContent } from '@material-ui/core';
import { Trans } from '@lingui/react';

import CCLogo from '../GlobalMenu/cc-logo.svg';
import config from '../../config';
import type { Category } from '../../types';
import Navbar from '../Navbar';
import GlobalMenu from '../GlobalMenu';
import { misc, colors } from '../../style/theme';
import { classRoomTheme } from '../../getPageContext';
import Container from '../../elements/Container';

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

const Footer = styled('footer')`
  background: #eff0f2;
  background: #e3e3e3;
  a {
    text-decoration: none;
    color: #444;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const LinkGrid = styled('div')`
  font-size: 0.8rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-row-gap: 13px;
  grid-column-gap: 26px;
  margin-top: 20px;
  margin-bottom: 20px;
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
        {wrapWithMain ? <Main component="main">{children}</Main> : children}
        <Footer>
          <Container size="large">
            <CardContent css={{ textAlign: 'center' }}>
              <a
                href="https://creativecommons.org/"
                component="a"
                aria-label="Creative Commons"
              >
                <CCLogo css={{ width: '100px' }} />
              </a>
            </CardContent>
            <CardContent>
              <a href={config.zendeskUrl}>
                <Trans>Found something? Report issues</Trans>
              </a>
              <LinkGrid>
                <a href="https://home.digitallibrary.io/about/">
                  <Trans>About the GDL</Trans>
                </a>
                <a href="https://home.digitallibrary.io/the-global-digital-library-uses-cookies/">
                  <Trans>Cookie policy</Trans>
                </a>
                <a href="https://home.digitallibrary.io/privacy/">
                  <Trans>Privacy policy</Trans>
                </a>
                <a href="https://blog.digitallibrary.io/cc/">
                  <Trans>Licensing and reuse</Trans>
                </a>
              </LinkGrid>
            </CardContent>
          </Container>
        </Footer>
      </PageWrapper>
    );
  }
}

export default Layout;
export { Main };
