// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import styled, { css } from 'react-emotion';
import theme from 'styled-theming';

import rotate360 from '../../style/rotate360';
import { colors, fonts } from '../../style/theme';

const color = theme('category', {
  library: css`
    color: ${colors.link.default};
    &:hover {
      color: ${colors.link.defaultHover};
    }
  `,
  classroom: css`
    color: ${colors.link.alternate};
    &:hover {
      color: ${colors.link.alternateHover};
    }
  `
});

export const A = styled('a')`
  ${color};
  font-size: inherit;
  border: none;
  background: transparent;
  &[disabled] {
    cursor: not-allowed;
    color: ${colors.base.gray};
  }
`;

export const uppcasedStyle = css`
  text-transform: uppercase;
`;

export const boldStyle = css`
  font-weight: ${fonts.weight.medium};
`;

export const underlineStyle = css`
  text-decoration: underline;
`;

export const loadingStyle = css`
  color: transparent;
  text-shadow: none;
  position: relative;
  pointer-events: none;
  &:after {
    animation: ${rotate360} 500ms infinite linear;
    border: 2px solid ${colors.base.black};
    border-radius: 100px;
    border-right-color: transparent;
    border-top-color: transparent;
    content: '';
    display: block;
    width: 0.8em;
    height: 0.8em;
    position: absolute;
    left: calc(50% - (0.8em / 2));
    top: calc(50% - (0.8em / 2));
  }
`;
