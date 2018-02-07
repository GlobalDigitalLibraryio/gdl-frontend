// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'react-emotion';
import { triangle } from 'polished';
import { Trans } from '@lingui/react';
import media from '../style/media';
import theme from '../style/theme';

const HEIGHT = '30px';

/**
 * Currently this component is specially tailored for use on the metadata card on the book page
 * Ie. this is not a reusable component at the moment
 */
const Ribbon = styled('div')`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  background-color: ${theme.colors.white};
  color: ${theme.colors.dark};
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
  padding-left: 20px;
  padding-right: 10px;
  font-weight: bold;
  font-size: 14px;
  text-transform: uppercase;
  position: relative;
  height: ${HEIGHT};
  float: right;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  ${media.mobile`
    position: absolute;
    right: 0;
  `} ${media.tablet`
    margin-right: -20px;
  `} &:before {
    content: '';
    display: block;
    position: absolute;
    left: -1px;
    top: 0;
    bottom: 0;
    ${triangle({
      pointingDirection: 'right',
      width: '15px',
      height: HEIGHT,
      foregroundColor: theme.colors.grayLighter
    })};
  }
`;

export default ({ level, ...props }: { level: string }) => (
  <Ribbon {...props}>
    <Trans>Level {level}</Trans>
  </Ribbon>
);
