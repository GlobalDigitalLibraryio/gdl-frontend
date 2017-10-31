// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import styled from 'styled-components';
import media from './helpers/media';

/**
 * Right aligned more links in header tags
 */
const More = styled.a`
  float: right;
  font-size: 12px;
  ${media.tablet`
    font-size: 14px;
  `};
`;

export default More;
