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

type Props = {|
  children: Node
|};

const NavContextBar = (props: Props) => (
  <Container size="large" width="100%">
    <View flexDirection="row" justifyContent="space-between" {...props} />
  </Container>
);

export default NavContextBar;
