// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled, { css } from 'react-emotion';
import { space } from 'styled-system';

import { misc } from '../style/theme';
import media from '../style/media';

// A special container used in the navbar/toolbar.
// Handles cases where you don't any any padding until we drop below the container size

const navContainerFragment = css`
  margin-left: auto;
  margin-right: auto;
  max-width: ${misc.containers.large};
  padding-left: 15px;
  padding-right: 15px;
  ${media.tablet`
    padding-left: 20px;
    padding-right: 20px;
  `};
  @media (min-width: ${misc.containers.large}) {
    padding-left: 0;
    padding-right: 0;
  }
`;

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

export { Container as default, navContainerFragment };
