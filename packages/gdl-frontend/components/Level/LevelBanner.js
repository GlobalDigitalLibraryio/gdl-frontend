// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import React from 'react';
import { triangle } from 'polished';
import type { ReadingLevel } from '../../types';
import ReadingLevelTrans from '../ReadingLevelTrans';
import { fonts } from '../../style/theme';
import media from '../../style/media';
import mq from '../../style/mq';
import styled from 'react-emotion';

const colorMap = {
  '1': '#5DD0C1',
  '2': '#84CB65',
  '3': '#F1C528',
  '4': '#FA9F28',
  'read-aloud': '#F56324',
  'new-arrivals':'#D3D3D3',
  decodable: '#AB86CD'
};

const Banner = styled('div')`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  text-transform: uppercase;
  background-color: ${p => colorMap[p.readingLevel]};
  color: black;
  position: relative;
  font-weight: ${fonts.weight.medium};
  padding: 1px 10px 0px 10px;
  &:before {
    content: '';
    top: 0;
    bottom: 0;
    display: block;
    position: absolute;
    left: ${p => p.fullWidth ? '70%' : '-15px' };
    ${p =>
      triangle({
        pointingDirection: 'right',
        width: '15px',
        height: '30px',
        backgroundColor: colorMap[p.readingLevel],
        foregroundColor: 'transparent'
      })};
    ${media.tablet`
      border-width: 20px 0px 20px 15px;
    `}
    ${mq({
      borderWidth: '20px 0px 20px 15px',
      height: [30, 40],
      fontSize: [14, 20]
    })};
  }
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
      border-width: 20px 15px 20px 0px;
    `}
    ${mq({
      borderWidth: '20px 15px 20px 0px'
    })};
  }
`;


type Props = {
  level: ReadingLevel,
  fullWidth: ?boolean
};

export default ({ level, fullWidth }: Props) => {
  return fullWidth ? (
    <Banner readingLevel={level} style={{width: '70%'}}>
      <ReadingLevelTrans readingLevel={level} />
    </Banner>
  ) : (
    <Banner readingLevel={level} >
      <ReadingLevelTrans readingLevel={level} />
    </Banner>
  );
}
