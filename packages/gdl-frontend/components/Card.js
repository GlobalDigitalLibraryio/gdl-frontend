// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled, { css } from 'react-emotion';
import { space, flex, textAlign } from 'styled-system';
import { colors, misc } from '../style/theme';

const cardCss = css`
  background: ${colors.base.white};
  position: relative;
  max-width: 100%;
  box-shadow: ${misc.boxShadows.small};
  color: ${colors.text.default};
`;

const Card = styled('div')(cardCss, space, textAlign, flex);

export default Card;
