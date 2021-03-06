// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import React from 'react';
import { FiberManualRecord as CircleLabel } from '@material-ui/icons';
import type { ReadingLevel } from '../../gqlTypes';
import colorMap from '../../style/colorMapping';

type Props = {
  level?: ReadingLevel,
  style?: Object
};

export default ({ level, style, ...props }: Props) => {
  return (
    <CircleLabel
      style={{
        color: level ? colorMap[level] : '#B4A4E5',
        marginBottom: '2px',
        ...style
      }}
      {...props}
    />
  );
};
