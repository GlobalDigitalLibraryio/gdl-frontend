// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { Global, css } from '@emotion/core';
import { colors, fonts } from '../style/theme';

// Add global styles
export default () => (
  <Global
    styles={css`
      body {
        font-family: ${fonts.family.default};
        text-rendering: optimizeLegibility;
        color: ${colors.text.default};

        strong {
          font-weight: ${fonts.weight.bold};
        }

        a {
          text-decoration: none;
        }

        a,
        button,
        [role='button'] {
          cursor: pointer;
        }
      }
    `}
  />
);
