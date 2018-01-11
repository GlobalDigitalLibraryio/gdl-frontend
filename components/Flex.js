// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled from 'react-emotion';
import {
  justifyContent,
  flexDirection,
  flexWrap,
  alignItems,
  space,
  flex,
  responsiveStyle
} from 'styled-system';
import height from '../style/height';
import textAlign from '../style/textAlign';

const order = responsiveStyle('order');

const display = responsiveStyle('display');

const Flex = styled('div')`
  display: flex;
  ${flexWrap}
  ${flexDirection}
  ${alignItems}
  ${justifyContent}
  ${space}
  ${height}
  ${textAlign}
  ${flex}
  ${order}
  ${display}
`;

export default Flex;
