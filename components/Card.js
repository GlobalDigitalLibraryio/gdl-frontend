// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled, { css } from 'styled-components';
import { space, flex } from 'styled-system';
import Box from './Box';
import theme from '../style/theme';
import textAlign from '../style/textAlign';

const cardCss = css`
  background: ${theme.colors.white};
  position: relative;
  max-width: 100%;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  color: ${theme.colors.dark};
`;

const CardBase = Box.extend`
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  border-radius: ${theme.borderRadius};
  color: ${theme.colors.dark};
`;

/* const Card = CardBase.extend`
  background: ${theme.colors.white};
  position: relative;
  max-width: 100%;
`; */

const Card = styled('div')`
  ${cardCss};
  ${space};
  ${textAlign};
  ${flex};
`;

export { Card as default, CardBase };
