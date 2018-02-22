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
import PlayfulCat from '../illustrations/cat-in-bag.svg';

const svgStyle = css`
  display: block;
  margin: 2rem auto;
  width: 155px;
  height: 134px;
  ${media.tablet`
    height: 284px;
    width: 328px;
  `};
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
