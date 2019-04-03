// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import { css } from '@emotion/core';
// $FlowFixMe getStyles does not exist, but since this test is skipped removes error for now
import { getStyles } from 'jest-emotion';
import media from '../media';

// TODO: Renable after jest-emotion pushes update that fixes this bug. Currently it doesn't run
// eslint-disable-next-line jest/no-disabled-tests
test.skip('Mobile first media template', () => {
  const templateLiteral = css`
    background: blue;
    ${media.tablet`background-red;`};
  `;

  expect(getStyles(templateLiteral)).toMatchSnapshot();
});
