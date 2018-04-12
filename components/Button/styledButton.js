// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled, { css } from 'react-emotion';
import { lighten } from 'polished';
import theme from 'styled-theming';
import rotate360 from '../../style/rotate360';
import media from '../../style/media';
import { colors, fonts } from '../../style/theme';

export const buttonColor = (backgroundColor: string) => css`
  background: ${backgroundColor};
  &:hover:not([disabled]) {
    background: ${lighten(0.04, backgroundColor)};
  }
`;

const color = theme('category', {
  library: buttonColor(colors.button.defaultBackground),
  classroom: buttonColor(colors.button.alternateBackground)
});

export const Button = styled('button')`
  color: ${colors.base.white};
  ${color};
  border-style: none;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
  font-weight: ${fonts.weight.medium};
  border-radius: 50px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: 210px;
  line-height: 22px;
  min-height: 38px;
  padding-left: 30px;
  padding-right: 30px;
  font-size: 16px;
  &[disabled] {
    opacity: 0.3;
    cursor: not-allowed;
  }
  ${media.tablet`
    min-height: 48px;
    font-size: 18px;
  `};
  transition: transform 0.15s ease-out, background 0.15s ease-out;
  &:hover:not([disabled]) {
    transform: translateY(-1px);
  }
`;

export const loadingStyle = css`
  color: transparent;
  text-shadow: none;
  position: relative;
  pointer-events: none;
  &:after {
    animation: ${rotate360} 500ms infinite linear;
    border: 2px solid ${colors.base.white};
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
`;
