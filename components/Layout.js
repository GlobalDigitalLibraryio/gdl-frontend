// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'styled-components';
import media from './helpers/media';
import Navbar from './Navbar';
import Breadcrumb from './Breadcrumb';
import Container from './Container';

type Props = {
  children: React.Node,
  currentPage?: string,
  toolbarEnd?: React.Node,
  lang: string,
};

const Toolbar = styled.div`
  background: ${props => props.theme.grays.white};
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  position: relative;
  font-size: 12px;
  height: 28px;
  ${media.tablet`
    font-size: 14px;
    height: 38px;
  `} ${Container} {
    width: 100%;
    height: 100%;
    display: flex;
  }
`;

const Layout = ({ children, toolbarEnd, currentPage, lang }: Props) => (
  <div>
    <Navbar lang={lang} />
    <Toolbar>
      <Container mw="1075px">
        <Breadcrumb currentPage={currentPage} lang={lang} />
        {toolbarEnd}
      </Container>
    </Toolbar>
    {children}
  </div>
);

export default Layout;
