// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled from 'react-emotion';
import styledMap from 'styled-map';
import theme from '../../style/theme';

const flagColor = styledMap('appearance', {
  success: theme.colors.greens.green,
  error: theme.colors.reds.light,
  info: theme.colors.blues.blue,
  warning: theme.colors.oranges.orange,
  // The last value is also the fallback value
  normal: theme.colors.grayDark
});

export const Container = styled('div')`
  border-left: 5px solid ${flagColor};
  display: flex;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px 16px;
  align-items: center;
`;

export const Icon = styled('span')`
  color: ${flagColor};
  width: 32px;
`;

export const DismissButton = styled.button`
  background: transparent;
  border: none;
  color: ${theme.colors.dark};
  outline: none;
  border-radius: 290486px;
  width: 32px;
  height: 32px;
  user-select: none;
  margin-right: -10px;
  &:hover,
  &:focus {
    background-color: rgba(70, 70, 70, 0.1);
  }
  svg {
    max-width: 100%;
  }
`;

export const Text = styled('div')`
  flex: 1 1 0;
`;
