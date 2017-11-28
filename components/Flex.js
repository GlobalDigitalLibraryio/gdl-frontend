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
  space,
  flex,
  responsiveStyle,
} from 'styled-system';
import height from './helpers/height';
import textAlign from './helpers/textAlign';

const column = props => (props.column ? 'flex-direction:column;' : null);

const order = responsiveStyle('order');

const Flex = styled('div')`
  display: flex;
  ${flexWrap} ${column} ${flexDirection} ${alignItems} ${justifyContent} ${space} ${height} ${textAlign} ${flex} ${order};
`;

export default Flex;
