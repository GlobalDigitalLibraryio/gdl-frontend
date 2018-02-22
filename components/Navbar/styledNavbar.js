// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import styled from 'react-emotion';
import { order } from 'styled-system';

import theme from '../../style/theme';
import media from '../../style/media';
import { navContainerFragment } from '../Container';

export const Nav = styled('nav')`
  position: relative;
  background: ${theme.colors.blues.dark};
`;

export const NavItem = styled('div')`
  ${order};
  color: ${theme.colors.white};
  font-weight: 500;
  font-size: 1.1rem;
  a {
    color: inherit;
  }
  span {
    margin-left: 6px;
    ${media.mobile`
      display: none;
    `};
  }
`;

export const HamburgerButton = styled('button')`
  background: transparent;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  vertical-align: top;
  border: 1px solid transparent;
  color: inherit;
  font-weight: inherit;
  font-size: inherit;
`;

export const BrandLink = styled('a')`
  svg {
    height: 35px;
    width: 75px;
    ${media.tablet`
      width: 110px;
    `};
  }
`;

export const Container = styled('div')`
  display: flex;
  align-items: center;
  ${navContainerFragment};
  justify-content: space-between;
  min-height: 54px;
  ${media.tablet`
    min-height: 80px;
  `};
`;
