// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import styled, { cx, css } from 'react-emotion';

import View from './View';
import { misc, spacing } from '../style/theme';

/**
 * Center content horizontally
 */
// FIXME: Currently margin left/right here overwrites any specific margin passed to <View /> :/
const StyledContainer = styled(View)`
  margin-left: auto;
  margin-right: auto;
  max-width: ${p => misc.containers[p.size]};
  padding-left: ${spacing.medium};
  padding-right: ${spacing.medium};
`;

type Props = {
  size: $Keys<typeof misc.containers>,
  stickToEdgeOnLargeScreens: boolean
};

const Container = ({ stickToEdgeOnLargeScreens, ...props }: Props) => (
  <StyledContainer
    className={cx({
      [stickToEdgeOnLargeScreensStyle]: stickToEdgeOnLargeScreens
    })}
    {...props}
  />
);

Container.defaultProps = {
  size: 'small',
  stickToEdgeOnLargeScreens: false
};

const stickToEdgeOnLargeScreensStyle = css`
  @media (min-width: ${misc.containers.large}) {
    padding-left: 0;
    padding-right: 0;
  }
`;

export default Container;
