// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from '@emotion/styled';
import { triangle } from 'polished';

import type { ReadingLevel } from '../../gqlTypes';
import ReadingLevelTrans from '../ReadingLevelTrans';
import { fonts, misc } from '../../style/theme';
import media from '../../style/media';
import mq from '../../style/mq';
import colorMap from '../../style/colorMapping';

/**
 * This component is specially tailored to align perfectly on the book details page.
 * So this is not a resuable component at the moment.
 */
const Ribbon = styled('div')`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  text-transform: uppercase;
  background-color: ${p => colorMap[p.readingLevel]};
  color: black;
  ${p =>
    mq({
      paddingLeft: [misc.gutter, 40, 40],
      paddingRight: [20, 40, 40],
      marginLeft: [-misc.gutter, -40, -40],
      marginRight: [20, 40, 40],
      height: [30, 40, 40],
      fontSize: [14, 20, 20]
    })}
  font-weight: ${fonts.weight.medium};
  position: relative;
  &:after {
    content: '';
    display: block;
    position: absolute;
    right: -15px;
    top: 0;
    bottom: 0;
    ${p =>
      triangle({
        pointingDirection: 'left',
        width: '15px',
        height: '30px',
        backgroundColor: colorMap[p.readingLevel],
        foregroundColor: 'transparent'
      })};
    ${media.tablet`
      border-width: 20px 15px 20px 0;
    `}
  }
`;

type Props = {
  level: ReadingLevel | 'Games'
};

export default ({ level }: Props) => (
  <Ribbon readingLevel={level}>
    <ReadingLevelTrans readingLevel={level} />
  </Ribbon>
);
