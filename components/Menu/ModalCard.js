// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled from 'react-emotion';
import Card from '../Card';
import media from '../../style/media';

export default styled(Card)`
  ${media.mobile`
    height: 100%;
    width: 100%;
  `} max-height: 100%;
  overflow: auto;
  overscroll-behavior: contain;
`;
