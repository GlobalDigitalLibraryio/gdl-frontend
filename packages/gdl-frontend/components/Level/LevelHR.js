// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'react-emotion';

import type { ReadingLevel } from '../../types';

const colorMap = {
  '1': '#5DD0C1',
  '2': '#84CB65',
  '3': '#F1C528',
  '4': '#FA9F28',
  'read-aloud': '#F56324',
  decodable: '#AB86CD'
};

const Hr = styled('hr')`
  border: 2px solid ${p => (p.level ? colorMap[p.level] : '#D2D2D2')};
  width: 100%;
`;

type Props = {
  level?: ReadingLevel
};

export default ({ level, ...props }: Props) => <Hr level={level} {...props} />;
