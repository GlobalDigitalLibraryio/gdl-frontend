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
    <PlayfulCat className={svgStyle} />
    <span>
      <Trans>
        <strong>អូ​ទេ!</strong> សូមព្យាយាមស្វែងរកអ្វីផ្សេងទៀត
      </Trans>
    </span>
  </div>
);

export default NoResults;
