// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled from 'react-emotion';
import { space } from 'styled-system';

import { misc } from '../style/theme';

/**
 * Center content horizontally
 */
const Container = styled('div')`
  margin-left: auto;
  margin-right: auto;
  ${space} max-width: ${p =>
  p.size === 'small' ? misc.containers.small : misc.containers.large};
`;

Container.defaultProps = {
  size: 'small',
  px: [15, 20]
};

export default Container;
