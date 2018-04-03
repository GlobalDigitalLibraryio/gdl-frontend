// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled from 'react-emotion';
import media from '../style/media';
import { fonts } from '../style/theme';

const H4 = styled.h4`
  font-weight: ${fonts.weight.medium};
  font-size: 16px;
  line-height: 22px;
  ${media.tablet`
    font-size: 20px;
    line-height: 26px;
  `};
  margin: 0;
`;

export default H4;
