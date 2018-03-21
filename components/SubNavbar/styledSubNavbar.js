// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import styled from 'react-emotion';
import media from '../../style/media';
import { navContainerFragment } from '../Container';
import theme from '../../style/theme';

export const Nav = styled('nav')`
  background: ${theme.colors.white};
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  position: relative;
  font-size: 14px;
  height: 48px;
  z-index: 10;
  ${media.tablet`
    font-size: 16px;
  `};
`;

export const Container = styled('div')`
  display: flex;
  height: 100%;
  ${navContainerFragment};
`;
