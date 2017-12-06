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
import height from '../style/height';
import textAlign from '../style/textAlign';

const column = props => (props.column ? 'flex-direction:column;' : null);

const order = responsiveStyle('order');

const display = responsiveStyle('display');

const Flex = styled('div')`
  ${display} ${flexWrap} ${column} ${flexDirection} ${alignItems} ${justifyContent} ${space} ${height} ${textAlign} ${flex} ${order};
`;

Flex.defaultProps = {
  display: 'flex',
};
export default Flex;
