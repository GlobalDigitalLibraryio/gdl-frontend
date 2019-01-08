// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import React from 'react';
import { FiberManualRecord as CircleLabel } from '@material-ui/icons';
import type { ReadingLevel } from '../../types';

const colorMap = {
  '1': '#5DD0C1',
  '2': '#84CB65',
  '3': '#F1C528',
  '4': '#FA9F28',
  'read-aloud': '#F56324',
  decodable: '#AB86CD'
};

type Props = {
  level?: ReadingLevel
};

export default ({ level, ...props }: Props) => {
  return (
    <CircleLabel
      style={{
        color: level ? colorMap[level] : '#D2D2D2',
        marginBottom: '2px'
      }}
      {...props}
    />
  );
};
