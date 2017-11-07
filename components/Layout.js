// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Breadcrumb from './Breadcrumb';
import Container from './Container';

type Props = {
  children: React.Node,
  currentPage?: string,
  toolbarEnd?: React.Node,
};

const Toolbar = styled.div`
  background: ${props => props.theme.grays.white};
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  font-size: 14px;
  position: relative;
  ${Container} {
    width: 100%;
    display: flex;
  }
`;

const Layout = ({ children, toolbarEnd, currentPage }: Props) => (
  <div>
    <Navbar />
    <Toolbar>
      <Container mw="1075px">
        <Breadcrumb currentPage={currentPage} />
        {toolbarEnd}
      </Container>
    </Toolbar>
    {children}
  </div>
);

export default Layout;
