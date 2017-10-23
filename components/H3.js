// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import styled from 'styled-components';
import media from './helpers/media';

const H3 = styled.h3`
  &:first-child {
    margin-top: 0;
  }
  text-transform: uppercase;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  ${media.tablet`
    font-size: 20px;
    line-height: 26px;
  `};
`;

export default H3;
