// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import Box from './Box';
import theme from '../style/theme';

const Hero = Box.extend`
  background: linear-gradient(180deg, #eff0f2 0%, #eaeaea 100%);
  border-bottom: solid 1px ${theme.colors.grayLighter};
`;

export default Hero;
