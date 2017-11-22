// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import Box from './Box';
import theme from '../style/theme';

const CardBase = Box.extend`
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  color: ${theme.colors.dark};
`;

const Card = CardBase.extend`
  background: ${theme.colors.white};
  position: relative;
  max-width: 100%;
`;

export { Card as default, CardBase };
