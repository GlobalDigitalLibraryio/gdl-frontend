// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import {
  justifyContent,
  flexDirection,
  flexWrap,
  alignItems,
} from 'styled-system';
import Box from './Box';

const column = props => (props.column ? 'flex-direction:column;' : null);

const Flex = Box.extend(
  [],
  { display: 'flex' },
  flexWrap,
  column,
  flexDirection,
  alignItems,
  justifyContent,
);

export default Flex;
