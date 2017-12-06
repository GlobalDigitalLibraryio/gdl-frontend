// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled from 'styled-components';
import { space } from 'styled-system';

import theme from '../style/theme';

/**
 * Center content horizontally
 */
const Container = styled('div')`
  margin-left: auto;
  margin-right: auto;
  ${space} max-width: ${p =>
      p.size === 'small' ? theme.containers.small : theme.containers.large};
`;

Container.defaultProps = {
  size: 'small',
  px: [15, 20],
};

export default Container;
