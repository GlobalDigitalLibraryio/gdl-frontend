// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import { css } from '@emotion/core';
import type { intlShape } from 'react-intl';

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

const translations = defineMessages({
  text: {
    id: 'Please try searching for something else',
    defaultMessage: 'Please try searching for something else.'
  },
  emph: {
    id: 'Oh no',
    defaultMessage: 'Oh no'
  }
});

const NoResults = ({ intl }: intlShape) => (
  <div css={{ textAlign: 'center' }} aria-hidden>
    <PlayfulCat css={svgStyle} />
    <span>
      <strong>{`${intl.formatMessage(translations.emph)}! `}</strong>
      {intl.formatMessage(translations.text)}
    </span>
  </div>
);

export default injectIntl(NoResults);
