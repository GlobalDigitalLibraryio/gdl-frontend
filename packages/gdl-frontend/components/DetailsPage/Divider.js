// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import styled from '@emotion/styled';
import { Divider as MuiDivider } from '@material-ui/core';

import { spacing } from '../../style/theme';
import media from '../../style/media';

const Divider = styled(MuiDivider)`
  margin: ${spacing.large} 0;
  ${media.tablet`
  margin: ${spacing.xxlarge} 0;
  `};
`;

export default Divider;
