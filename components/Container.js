// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled from 'styled-components';
import { Box } from 'grid-styled';

/**
 * Center content horizontally
 */
const Container = styled(Box)`max-width: 738px;`;

Container.defaultProps = {
  mx: 'auto',
  px: 15,
};

export default Container;
