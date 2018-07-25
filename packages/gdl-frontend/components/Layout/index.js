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
import { Paper } from '@material-ui/core';
import { Trans } from '@lingui/react';

import CCLogo from '../GlobalMenu/cc-logo.svg';
import config from '../../config';
import type { Category } from '../../types';
import Navbar from '../Navbar';
import GlobalMenu from '../GlobalMenu';
import { misc, colors } from '../../style/theme';
import media from '../../style/media';

import { classRoomTheme } from '../../getPageContext';
import Container from '../../elements/Container';

import FaFacebookSquare from 'react-icons/lib/fa/facebook-square';
import FaTwitterSquare from 'react-icons/lib/fa/twitter-square';
import FaGithubSquare from 'react-icons/lib/fa/github-square';

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
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
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
  grid-template-columns: repeat(3, 1fr);
  grid-row-gap: 13px;
  grid-column-gap: 26px;
  margin-top: 20px;
  margin-bottom: 20px;
  ${media.tablet`
    width: 100%;
    grid-template-columns: repeat(6, 1fr);
  `};
`;

export const SocialMediaIcons = styled('div')`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  a {
    font-size: 2.25rem;
    color: #555;
    &:hover {
      color: ${colors.default};
    }
  }
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
        {wrapWithMain ? (
          <Main square component="main">
            {children}
          </Main>
        ) : (
          children
        )}
        <Container size="large" stickToEdgeOnLargeScreens width="100%">
          <Footer>
            <LinkGrid>
              <a href="https://home.digitallibrary.io/the-global-digital-library-uses-cookies/">
                <Trans>Cookie policy</Trans>
              </a>
              <a href="https://home.digitallibrary.io/privacy/">
                <Trans>Privacy policy</Trans>
              </a>
              <a href="https://blog.digitallibrary.io/cc/">
                <Trans>Licensing and reuse</Trans>
              </a>
              <a href={config.zendeskUrl}>
                <Trans>Report issues</Trans>
              </a>

              <a href="https://home.digitallibrary.io/about/">
                <Trans>About</Trans>
              </a>
              <a href="https://blog.digitallibrary.io/">
                <Trans>Blog</Trans>
              </a>
            </LinkGrid>

            <div
              css={{
                border: '1px solid grey',
                width: '100%',
                margin: '10px'
              }}
            />

            <a
              href="https://creativecommons.org/"
              component="a"
              aria-label="Creative Commons"
            >
              <CCLogo css={{ width: '100px' }} />
            </a>

            <SocialMediaIcons>
              <a href="https://nb-no.facebook.com/globaldigitallibrary/">
                <FaFacebookSquare />
              </a>
              <a href="">
                <FaTwitterSquare />
              </a>
              <a href="">
                <FaGithubSquare />
              </a>
            </SocialMediaIcons>
          </Footer>
        </Container>
      </PageWrapper>
    );
  }
}

export default Layout;
export { Main };
