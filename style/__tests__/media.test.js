// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import { css } from 'react-emotion';
import { getStyles } from 'jest-emotion';
import media from '../media';

// TODO: Renable after jest-emotion pushes update that fixes this bug. Currently it doesn't run
test.skip('Mobile first media template', () => {
  const templateLiteral = css`
    background: blue;
    ${media.tablet`background-red;`};
  `;

  expect(getStyles(templateLiteral)).toMatchSnapshot();
});
