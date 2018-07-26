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
import FaYoutubeSquare from 'react-icons/lib/fa/youtube-square';

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
  margin-top: 40px;
  margin-bottom: 50px;
  a {
    text-decoration: none;
    color: ${colors.text.default};
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const LinkGrid = styled('div')`
  order: 2;
  font-size: 0.8rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-row-gap: 13px;
  grid-column-gap: 26px;
  margin-top: 20px;
  margin-bottom: 20px;
  ${media.tablet`
    flex-grow: 3;
    grid-template-columns: repeat(3, 1fr);
  `};
`;

export const SocialMediaIcons = styled('div')`
  display: flex;
  justify-content: space-evenly;
  flex-grow: 1;
  a {
    font-size: 2.25rem;
    color: ${colors.text.subtle};
    &:hover {
      color: ${colors.default};
    }
  }
  ${media.tablet`
    order: 4;
  `};
  ${media.mobile`
    order: 1;
    margin-top: 12px;
    margin-bottom: 12px;
  `};
`;

export const CreativeCommons = styled('div')`
  flex-grow: 1;
  order: 3;
  text-align: center;
  a {
    &:hover {
    fill: ${colors.default};
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
            <div
              css={[
                {
                  order: 2,
                  border: 'solid 1px #e3e3e3',
                  width: '100%',
                  margin: '10px'
                },
                media.tablet({ display: 'none' })
              ]}
            />

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

            <CreativeCommons>
              <a
                href="https://creativecommons.org/"
                component="a"
                aria-label="Creative Commons"
              >
                <CCLogo css={{ width: '100px' }} />
              </a>
            </CreativeCommons>

            <SocialMediaIcons>
              <a
                aria-label="Facebook"
                href="https://nb-no.facebook.com/globaldigitallibrary/"
              >
                <FaFacebookSquare />
              </a>
              <a
                aria-label="Twitter"
                href="https://www.facebook.com/globaldigitallibrary/"
              >
                <FaTwitterSquare />
              </a>
              <a
                aria-label="Youtube"
                href="https://www.youtube.com/channel/UCN5RyDXS_aKA37YwIPzQPTg"
              >
                <FaYoutubeSquare />
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
