// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { css } from '@emotion/core';

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
  <div css={{ textAlign: 'center' }} aria-hidden>
    <PlayfulCat css={svgStyle} />
    <span>
      <FormattedMessage
        id="Please try searching for something else"
        defaultMessage="{emph} Please try searching for something else."
        values={{
          emph: <strong>Oh no!</strong>
        }}
      />
    </span>
  </div>
);

export default NoResults;
