// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import styled from 'styled-components';
import {
  justifyContent,
  flexDirection,
  flexWrap,
  alignItems,
} from 'styled-system';
import Box from './Box';

const column = props => (props.column ? 'flex-direction:column;' : null);

const Flex = styled(Box)`
  display: flex;
  ${flexWrap} ${column} ${flexDirection} ${alignItems} ${justifyContent};
`;

export default Flex;
