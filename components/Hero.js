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
      ? 'linear-gradient(90deg, #014C90 0%, #4EAD81 100%)'
      : 'linear-gradient(180deg, #eff0f2 0%, #eaeaea 100%)'};
  border-top: ${props => (props.borderTop ? 'solid 1px #e0e0e0' : null)};
  border-bottom: ${props => (props.borderBottom ? 'solid 1px #e0e0e0' : null)};
`;

Hero.defaultProps = {
  py: '1rem',
};

export default Hero;
