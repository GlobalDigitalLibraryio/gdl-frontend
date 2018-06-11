// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'react-emotion';

import type { ReadingLevel } from '../types';
import ReadingLevelTrans from './ReadingLevelTrans';
import media from '../style/media';
import { colors, misc } from '../style/theme';

const Label = styled('span')`
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  border-radius: ${misc.radius};
  background-color: ${colors.base.grayDarkest};
  color: ${colors.base.white};
  padding-left: 10px;
  padding-right: 10px;
  font-size: 11px;
  line-height: 17px;
  ${media.tablet`
    font-size: 12px;
    line-height: 18px;
  `};
`;

type Props = {|
  level: ReadingLevel
|};

export default ({ level }: Props) => (
  <div css={{ textAlign: 'center' }}>
    <Label>
      <ReadingLevelTrans readingLevel={level} />
    </Label>
  </div>
);
