// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'styled-components';
import { triangle } from 'polished';
import { Trans } from 'lingui-react';
import media from '../style/media';
import theme from '../style/theme';

const HEIGHT = '30px';

const Ribbon = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  background-color: ${theme.colors.greens.green};
  color: ${theme.colors.white};
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
  padding-left: 10px;
  padding-right: 10px;
  font-weight: bold;
  font-size: 14px;
  text-transform: uppercase;
  position: relative;
  height: ${HEIGHT};
  float: right;
  margin-right: -15px;
  ${media.tablet`
    margin-right: -20px;
  `};
  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    margin-left: -20px;
    ${triangle({
      pointingDirection: 'right',
      width: '20px',
      height: HEIGHT,
      foregroundColor: 'transparent',
      backgroundColor: theme.colors.greens.green,
    })};
  }
`;

export default ({ level, ...props }: { level: string }) => (
  <Ribbon {...props}>
    <Trans>Level {level}</Trans>
  </Ribbon>
);
