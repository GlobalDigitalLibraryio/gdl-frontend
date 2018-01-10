// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled from 'react-emotion';
import media from '../style/media';

/**
 * Right aligned more links in header tags
 *
 */
const More = styled.a`
  float: right;
  font-size: 12px;
  ${media.tablet`
    font-size: 14px;
  `};
  padding: 0 0 5px 5px;
`;
// add a tiny bit of padding to inclease the click surface on mobile (left and bottom only so it doesn't affect layout)

export default More;
