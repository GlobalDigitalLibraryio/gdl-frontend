// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import { injectGlobal } from 'react-emotion';
import { colors, fonts } from './theme';

// Add global styles
export default injectGlobal`
  body {
    font-family: ${fonts.family.default};
    text-rendering: optimizeLegibility;
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
