// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import Navbar from './Navbar';
import Breadcrumb from './Breadcrumb';
import Container from './Container';
import Toolbar from './Toolbar';

type Props = {
  children: React.Node,
  currentPage: string,
};

const Layout = ({ children, currentPage }: Props) => (
  <div>
    <Navbar />
    <Toolbar>
      <Container mw="1075px">
        <Breadcrumb currentPage={currentPage} />
      </Container>
    </Toolbar>
    {children}
  </div>
);

export default Layout;
