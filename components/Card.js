// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import Box from './Box';

const CardBase = Box.extend`
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  color: ${props => props.theme.grays.dark};
`;

const Card = CardBase.extend`
  background: ${props => props.theme.grays.white};
  position: relative;
  max-width: 100%;

  & hr {
    background-color: ${props => props.theme.grays.platinum};
    height: 1px;
    border: none;
  }
`;

export { Card as default, CardBase };
