// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import styled from 'react-emotion';
import { display } from 'styled-system';
import theming from 'styled-theming';

import theme from '../../style/theme';
import media from '../../style/media';
import { navContainerFragment } from '../Container';

const backgroundColor = theming('category', {
  library: theme.colors.blues.dark,
  classroom: theme.colors.pinks.dark
});

export const Bar = styled('div')`
  position: relative;
  background: ${backgroundColor};
`;

export const NavItem = styled('div')`
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

// The tiny bit of padding here prevents the 'A' in 'Beta' from getting smooshed
export const BrandLink = styled('a')`
  svg {
    margin-top: 2px;
    padding-right: 2px;
    height: 36px;
    width: 100px;
    ${media.tablet`
      width: auto;
    `};
  }
`;

export const DisplayContainer = styled('div')`
  ${display};
  align-items: center;
  ${navContainerFragment};
  justify-content: space-between;
  min-height: 54px;
  ${media.tablet`
    justify-content: flex-end;
    min-height: 80px;
  `};
`;
