// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { type Node } from 'react';
import { Nav, Container } from './styledSubNavbar';

type Props = {|
  children: Node
|};

const NavContextBar = (props: Props) => (
  <Nav>
    <Container {...props} />
  </Nav>
);

export default NavContextBar;
