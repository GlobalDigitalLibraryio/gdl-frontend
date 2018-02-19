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
  textAlign,
  order,
  display
} from 'styled-system';
import height from '../style/height';

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
