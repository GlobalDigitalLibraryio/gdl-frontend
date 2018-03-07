// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from '@lingui/react';
import { css } from 'react-emotion';

import Box from '../../Box';
import media from '../../../style/media';
import Search from '../illustrations/Search.svg';

const svgStyle = css`
  display: block;
  margin: 2rem auto;
  width: 216px;
  height: 145px;
  ${media.tablet`
    height: 220px;
    width: 328px;
  `};
`;

const Placeholder = () => (
  <Box textAlign="center">
    <Search className={svgStyle} aria-hidden />
    <Trans>Search for books.</Trans>
  </Box>
);

export default Placeholder;
