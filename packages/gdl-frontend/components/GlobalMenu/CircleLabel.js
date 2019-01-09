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
import colorMap from '../../style/colorMapping';

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
