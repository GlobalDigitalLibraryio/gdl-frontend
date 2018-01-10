// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled, { css } from 'react-emotion';
import { space, flex } from 'styled-system';
import theme from '../style/theme';
import textAlign from '../style/textAlign';

const cardCss = css`
  background: ${theme.colors.white};
  position: relative;
  max-width: 100%;
  box-shadow: ${theme.boxShadows.small};
  color: ${theme.colors.dark};
`;

const Card = styled('div')(cardCss, space, textAlign, flex);

export default Card;
