// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled from 'react-emotion';
import { fontSize } from 'styled-system';
import lineHeight from '../style/lineHeight';

const P = styled.p`
  ${fontSize};
  ${lineHeight};
  &:last-child {
    margin-bottom: 0;
  }
`;

export default P;
