// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled, { css } from 'react-emotion';
import { lighten } from 'polished';
import rotate360 from '../style/rotate360';
import media from '../style/media';
import theme from '../style/theme';

const buttonFragment = (color: string) => css`
  color: ${theme.colors.white};
  background: ${color};
  border-style: none;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
  font-weight: 500;
  border-radius: 50px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: 150px;
  line-height: 22px;
  text-transform: uppercase;
  min-height: 38px;
  min-width: 210px;
  font-size: 16px;
  &[disabled] {
    opacity: 0.3;
    cursor: not-allowed;
  }
  ${media.tablet`
    min-height: 48px;
    font-size: 18px;
  `};
  transition: all 0.15s ease-out;
  &:hover:not([disabled]) {
    transform: translateY(-1px);
    background: ${lighten(0.04, color)};
  }
`;

const ButtonLink = styled('a')`
  ${buttonFragment(theme.colors.link)};
`;

const Button = styled('button')`
  ${buttonFragment(theme.colors.link)};
  ${p =>
    p.loading &&
    `
    color: transparent;
    text-shadow: none;
    position: relative;
    pointer-events: none;
    &:after {
      animation: ${rotate360} 500ms infinite linear;
      border: 2px solid ${theme.colors.white};
      border-radius: 100px;
      border-right-color: transparent;
      border-top-color: transparent;
      content: '';
      display: block;
      width: 1em;
      height: 1em;
      position: absolute;
      left: calc(50% - (1em / 2));
      top: calc(50% - (1em / 2));
    }
  `};
`;

export { buttonFragment, ButtonLink, Button };
