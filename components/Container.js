// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import Box from './Box';

/**
 * Center content horizontally
 */
const Container = Box.extend`
  margin-left: auto;
  margin-right: auto;
`;

Container.defaultProps = {
  mw: '738px',
  px: [15, 20],
};

export default Container;
