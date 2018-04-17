// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { type Node } from 'react';
import { css } from 'react-emotion';

import Container from '../../elements/Container';
import media from '../../style/media';
import { colors } from '../../style/theme';

type Props = {|
  children: Node
|};

const NavContextBar = (props: Props) => (
  <nav className={barStyle}>
    <Container
      size="large"
      width="100%"
      stickToEdgeOnLargeScreens
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      style={{ height: '100%' }}
      {...props}
    />
  </nav>
);

const barStyle = css`
  background: ${colors.base.white};
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  position: relative;
  font-size: 14px;
  height: 48px;
  z-index: 10;
  ${media.tablet`
    font-size: 16px;
  `};
`;

export default NavContextBar;
