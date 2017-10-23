// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import Box from './Box';

const Hero = Box.extend`
  background: ${props =>
    props.colorful
      ? 'linear-gradient(135deg, #004b91 0%, #5abc7f 100%)'
      : 'linear-gradient(180deg, #eff0f2 0%, #eaeaea 100%)'};
  border-bottom: ${props =>
    !props.colorful ? `solid 1px ${props.theme.grays.platinum}` : null};
`;

export default Hero;
