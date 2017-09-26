// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import styled from 'styled-components';
import { responsiveStyle } from 'styled-system';
import Box from './Box';

const wrap = responsiveStyle('flex-wrap', 'wrap', 'wrap');
const direction = responsiveStyle('flex-direction', 'direction');
const align = responsiveStyle('align-items', 'align');
const justify = responsiveStyle('justify-content', 'justify');
const column = props => (props.column ? 'flex-direction:column;' : null);

const Flex = styled(Box)(
  [],
  { display: 'flex' },
  wrap,
  column,
  direction,
  align,
  justify,
);

Flex.displayName = 'Flex';

export default Flex;
