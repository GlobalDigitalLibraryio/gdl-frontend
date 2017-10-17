// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import { css } from 'styled-components';
import media from '../media';

test('Mobile first media template', () => {
  const templateLiteral = css`
    background: blue;
    ${media.tablet`background-red;`};
  `;

  expect(templateLiteral).toMatchSnapshot();
});
