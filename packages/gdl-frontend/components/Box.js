// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled from 'react-emotion';
import {
  fontSize,
  space,
  color,
  width,
  flex,
  textAlign,
  order
} from 'styled-system';
import height from '../style/height';

const Box = styled('div')(
  fontSize,
  width,
  space,
  flex,
  order,
  height,
  color,
  textAlign
);

export default Box;
