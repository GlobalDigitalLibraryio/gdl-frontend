// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import { css } from 'react-emotion';
import { normalize } from 'polished';
import theme from './theme';

// Add global styles
// eslint-disable-next-line no-unused-expressions
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
    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI',
      'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
      'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    background: ${theme.colors.whiteTer};
    color: ${theme.colors.dark};

    a {
      color: ${theme.colors.link};
      text-decoration: none;
    }

    a[type='button'] {
      -webkit-appearance: none;
    }

    strong {
      font-weight: bold;
    }

    button,
    [role='button'] {
      cursor: pointer;
    }
  }
`;
