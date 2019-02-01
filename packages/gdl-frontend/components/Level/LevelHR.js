// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from '@emotion/styled';

import type { ReadingLevel } from '../../types';
import colorMap from '../../style/colorMapping';

const Hr = styled('hr')`
  border: 2px solid ${p => (p.level ? colorMap[p.level] : '#B4A4E5')};
  width: 100%;
`;

type Props = {
  level?: ReadingLevel
};

export default ({ level, ...props }: Props) => <Hr level={level} {...props} />;
