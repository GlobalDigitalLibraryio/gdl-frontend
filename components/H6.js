// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled from 'react-emotion';
import media from '../style/media';

const H6 = styled.h6`
  margin-top: 0;
  margin-bottom: 0;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 12px;
  line-height: 16px;
  ${media.tablet`
    font-size: 14px;
    line-height: 18px;
  `};
`;

export default H6;
