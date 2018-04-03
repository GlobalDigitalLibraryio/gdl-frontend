// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import styled from 'react-emotion';
import media from '../../style/media';
import { fonts } from '../../style/theme';

export const Heading = styled('div')`
  margin-top: 0;
  margin-bottom: 0;
  text-transform: uppercase;
  font-weight: ${fonts.weight.bold};
  font-size: 0.8rem;
  ${media.tablet`
    font-size: 0.9rem;
  `};
`;
