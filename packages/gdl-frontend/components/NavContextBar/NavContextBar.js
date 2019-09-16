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
import { SIDE_DRAWER_WIDTH } from '../../style/constants';
import { misc } from '../../style/theme';
import media from '../../style/media';
import css from '@emotion/css';

const styles = {
  paper: css`
    z-index: 10;
    margin-left: 0;
    ${media.largerTablet`
      margin-left: ${SIDE_DRAWER_WIDTH}px;
    `}
  `
};

type Props = {|
  children: Node
|};

const NavContextBar = (props: Props) => (
  <Paper css={styles.paper}>
    <Container
      size="large"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      style={{ height: '48px', maxWidth: misc.containers.small }}
      {...props}
    />
  </Paper>
);

export default NavContextBar;
