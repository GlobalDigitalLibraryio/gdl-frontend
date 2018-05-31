// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { type Node } from 'react';
import { Paper } from '@material-ui/core';

import Container from '../../elements/Container';

type Props = {|
  children: Node
|};

const NavContextBar = (props: Props) => (
  <Paper css={{ zIndex: 10 }}>
    <Container
      size="large"
      width="100%"
      stickToEdgeOnLargeScreens
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      style={{ height: '48px' }}
      {...props}
    />
  </Paper>
);

export default NavContextBar;
