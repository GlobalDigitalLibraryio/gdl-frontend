// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'react-emotion';
import { PortalWithState } from 'react-portal';
import type { Language } from '../types';
import media from '../style/media';
import Navbar from './Navbar';
import Breadcrumb from './Breadcrumb';
import { navContainerFragment } from './Container';
import Sidemenu from './Sidemenu';
import theme from '../style/theme';

const Toolbar = styled('div')`
  background: ${theme.colors.white};
  box-shadow: ${theme.boxShadows.small};
  position: relative;
  font-size: 13px;
  height: 28px;
  z-index: 10;
  ${media.tablet`
    font-size: 16px;
    height: 38px;
  `};
`;

const Container = styled('div')`
  display: flex;
  height: 100%;
  ${navContainerFragment};
`;

const ContentWrapper = styled('div')`
  box-shadow: ${theme.boxShadows.large};
  background: ${theme.colors.grayLighter};
  flex: 1;
  width: 100%;
  max-width: ${theme.containers.large};
  margin-left: auto;
  margin-right: auto;
`;

const PageWrapper = styled('div')`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

type Props = {
  children: React.Node,
  toolbarEnd?: React.Node,
  currentPage?: string,
  language: Language
};

class Layout extends React.Component<Props> {
  static defaultProps = {
    language: {
      code: 'eng',
      name: 'English'
    }
  };

  render() {
    const { children, toolbarEnd, language, currentPage } = this.props;
    return (
      <PageWrapper>
        <PortalWithState closeOnOutsideClick closeOnEsc>
          {({ portal, closePortal, openPortal, isOpen }) => [
            <Navbar
              lang={language.code}
              onMenuClick={openPortal}
              menuIsExpanded={isOpen}
            />,
            <Toolbar>
              <Container>
                <Breadcrumb language={language} currentPage={currentPage} />
                {toolbarEnd}
              </Container>
            </Toolbar>,
            portal(
              <Sidemenu
                id="sidenav"
                onCloseRequested={closePortal}
                language={language}
              />
            )
          ]}
        </PortalWithState>
        <ContentWrapper>{children}</ContentWrapper>
      </PageWrapper>
    );
  }
}

export default Layout;
