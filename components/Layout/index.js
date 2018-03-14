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
import type { Language } from '../../types';
import Navbar from '../Navbar';
import SubNavbar from '../SubNavbar';
import GlobalMenu from '../GlobalMenu';
import theme from '../../style/theme';

const ContentWrapper = styled('main')`
  box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.2);
  background: ${theme.colors.whiteTer};
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
  language: Language,
  languages?: Array<Language>,
  crumbs?: Array<React.Node | string>
};

const Layout = ({ children, languages, language, crumbs }: Props) => (
  <PageWrapper>
    <PortalWithState>
      {({ portal, closePortal, openPortal, isOpen }) => (
        <React.Fragment>
          <nav>
            <Navbar
              lang={language.code}
              onMenuClick={openPortal}
              menuIsExpanded={isOpen}
            />
            {(crumbs || languages) && (
              <SubNavbar
                crumbs={crumbs}
                languages={languages}
                language={language}
              />
            )}
          </nav>
          {portal(<GlobalMenu onClose={closePortal} language={language} />)}
        </React.Fragment>
      )}
    </PortalWithState>
    <ContentWrapper>{children}</ContentWrapper>
  </PageWrapper>
);

Layout.defaultProps = {
  language: {
    code: 'eng',
    name: 'English'
  }
};

export default Layout;
