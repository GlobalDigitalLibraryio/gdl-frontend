// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import styled from 'styled-components';
import { fontSize } from 'styled-system';
import Box from './Box';

const CardNew = Box.extend`
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  color: ${props => props.theme.grays.dark};
`;

const Card = CardNew.extend`
  background: ${props => props.theme.grays.white};
  position: relative;
  max-width: 100%;

  & hr {
    background-color: ${props => props.theme.grays.platinum};
    height: 1px;
    border: none;
  }
`;

Card.defaultProps = {
  px: 15,
  py: 12,
};

const CardAction = styled.a`
  ${fontSize} font-weight: 600;
  display: flex;
  align-items: center;
  & svg:nth-of-type(1) {
    margin-right: 10px;
  }
  & svg:nth-of-type(2) {
    margin-left: auto;
  }
`;

CardAction.defaultProps = {
  fontSize: 16,
};

export { Card as default, CardNew, CardAction };
