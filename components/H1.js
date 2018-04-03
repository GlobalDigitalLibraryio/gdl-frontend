// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled from 'react-emotion';
import { textAlign } from 'styled-system';
import media from '../style/media';
import { fonts } from '../style/theme';

const H1 = styled.h1`
  margin: 0;
  font-weight: ${fonts.weight.medium};
  font-size: 26px;
  line-height: 30px;
  ${media.tablet`
    font-size: 36px;
    line-height: 42px;
  `};
  ${textAlign};
`;

export default H1;
