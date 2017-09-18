// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import { Box } from 'grid-styled';

/**
 * Center content horizontally
 */
const Container = Box.extend`max-width: ${props => props.maxWidth}px;`;

Container.defaultProps = {
  mx: 'auto',
  px: 15,
  maxWidth: 738,
};

export default Container;
