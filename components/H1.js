// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import styled from 'styled-components';
import media from './helpers/media';
import textAlign from './helpers/textAlign';

const H1 = styled.h1`
  ${textAlign} &:first-child {
    margin-top: 0;
  }
  font-weight: 500;
  font-size: 26px;
  line-height: 30px;
  ${media.tablet`
    font-size: 36px;
    line-height: 42px;
  `};
`;

export default H1;
