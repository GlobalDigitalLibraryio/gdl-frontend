// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { type Node } from 'react';
// import { Nav, Container } from './styledSubNavbar';
import View from '../../elements/View';
import Container from '../../elements/Container';
import { Nav } from './styledSubNavbar';

type Props = {|
  children: Node
|};

const NavContextBar = (props: Props) => (
  <Nav>
    <Container
      size="large"
      width="100%"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      style={{ height: '100%' }}
      {...props}
    />
  </Nav>
);

export default NavContextBar;
