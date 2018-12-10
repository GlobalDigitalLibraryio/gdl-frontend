// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import React from 'react';
import type { ReadingLevel } from '../../types';
import ReadingLevelTrans from '../ReadingLevelTrans';
import { fonts } from '../../style/theme';
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

const Label = styled('div')`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  text-transform: uppercase;
  background-color: ${p => colorMap[p.readingLevel]};
  color: black;
  position: relative;
  font-weight: ${fonts.weight.medium};
  width: 100%;
  padding: 0px 20px 0px 20px;
`;

type Props = {
  level: ReadingLevel
};

export default ({ level }: Props) => {
  return (
    <Label readingLevel={level}>
      <ReadingLevelTrans readingLevel={level} />
    </Label>
  );
}
