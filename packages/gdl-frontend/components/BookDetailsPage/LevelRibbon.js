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

import type { ReadingLevel } from '../../types';
import ReadingLevelTrans from '../ReadingLevelTrans';
import { fonts } from '../../style/theme';
import mq from '../../style/mq';

const HEIGHT = '30px';

const colorMap = {
  '1': '#5DD0C1',
  '2': '#84CB65',
  '3': '#F1C528',
  '4': '#FA9F28',
  'read-aloud': '#F56324',
  decodable: '#AB86CD'
};

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
  padding-right: 20px;
  ${mq({
    paddingLeft: ['30px', '40px'],
    marginLeft: ['-30px', '-40px']
  })}
  font-weight: ${fonts.weight.bold};
  font-size: 14px;
  position: relative;
  height: ${HEIGHT};
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
        height: HEIGHT,
        backgroundColor: colorMap[p.readingLevel],
        foregroundColor: 'transparent'
      })};
  }
`;

type Props = {
  level: ReadingLevel
};

export default ({ level }: Props) => (
  <Ribbon readingLevel={level}>
    <ReadingLevelTrans readingLevel={level} />
  </Ribbon>
);
