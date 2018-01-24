// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'react-emotion';
import { Trans } from '@lingui/react';
import media from '../style/media';
import theme from '../style/theme';

const Label = styled('span')`
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  background-color: ${theme.colors.grayDarker};
  color: ${theme.colors.white};
  padding-left: 10px;
  padding-right: 10px;
  font-size: 11px;
  line-height: 17px;
  ${media.tablet`
    font-size: 12px;
    line-height: 18px;
  `};
`;

export default ({ level, ...props }: { level: string }) => (
  <Label {...props}>
    <Trans>Level {level}</Trans>
  </Label>
);
