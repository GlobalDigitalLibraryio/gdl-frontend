// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled from 'styled-components';
import Box from './Box';

/**
 * Center content horizontally
 */
const Container = styled(Box)`
  margin-left: auto;
  margin-right: auto;
  padding-left: 15px;
  padding-right: 15px;
`;

Container.defaultProps = {
  mw: '738px',
};

export default Container;
