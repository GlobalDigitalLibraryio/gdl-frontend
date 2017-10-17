// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import { css } from 'styled-components';
import { constants } from 'styled-system';
import type { TaggedTemplateLiteral } from 'styled-components';

/**
 * Mobile first media template
 *
 * Keeps compability with styled-system (hence the breakpoint import)
 */

const sizes = {
  tablet: constants.breakpoints[0],
};

// Iterate through the sizes and create a media template
const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args: TaggedTemplateLiteral) => css`
    @media (min-width: ${sizes[label]}em) {
      ${css(...args)};
    }
  `;

  return acc;
}, {});

export default media;
