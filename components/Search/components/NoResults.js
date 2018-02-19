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

import PlayfulCat from '../illustrations/PlayfulCat.svg';

const svgStyle = css`
  width: 155px;
  height: 134px;
  display: block;
  margin: 2rem auto;
`;

const NoResults = () => (
  <Box textAlign="center">
    <PlayfulCat className={svgStyle} />
    <span>
      <Trans>
        <strong>Oh no!</strong> Please try searching for something else.
      </Trans>
    </span>
  </Box>
);

export default NoResults;
