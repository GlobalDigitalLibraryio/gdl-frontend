// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import styled, { css } from 'react-emotion';
import theming from 'styled-theming';

import rotate360 from '../../style/rotate360';
import theme from '../../style/theme';

const color = theming('category', {
  library: css`
    color: ${theme.colors.link};
    &:hover {
      color: ${theme.colors.blues.dark};
    }
  `,
  classroom: css`
    color: ${theme.colors.pinks.dark};
    &:hover {
      color: ${theme.colors.pinks.pink};
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
    color: ${theme.colors.gray};
  }
`;

export const uppcasedStyle = css`
  text-transform: uppercase;
`;

export const boldStyle = css`
  font-weight: 500;
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
    border: 2px solid ${theme.colors.dark};
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
