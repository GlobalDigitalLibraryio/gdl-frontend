// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import { css } from 'react-emotion';
import { normalize } from 'polished';
import { colors, fonts } from './theme';

// Add global styles
export default css`
  ${normalize(true)} *, *:before, *:after {
    box-sizing: inherit;
  }

  html {
    box-sizing: border-box;
    font-size: 16px;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: ${fonts.family.default};
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    background: #fff;
    color: ${colors.text.default};

    a {
      color: ${colors.link.default};
      text-decoration: none;
    }

    strong {
      font-weight: ${fonts.weight.bold};
    }

    a,
    button,
    [role='button'] {
      cursor: pointer;
    }
  }
`;
