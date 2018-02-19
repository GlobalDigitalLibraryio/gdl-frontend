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

import Search from '../illustrations/Search.svg';

const svgStyle = css`
  width: 216px;
  height: 145px;
  display: block;
  margin: 2rem auto;
`;

const Placeholder = () => (
  <Box textAlign="center">
    <Search className={svgStyle} />
    <Trans>Type any word in the search field above to start your search.</Trans>
  </Box>
);

export default Placeholder;
