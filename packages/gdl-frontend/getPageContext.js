// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

// $FlowFixMe: Ignore flow errors from lib import
import { SheetsRegistry, create } from 'jss';
import {
  createMuiTheme,
  createGenerateClassName,
  jssPreset
} from '@material-ui/core/styles';
import { colors } from './style/theme';

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  // Opt in to the typography v2 components. Remove this when we're on Material UI v4
  typography: {
    useNextVariants: true
  },
  palette: {
    primary: {
      main: colors.default
    }
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: '20px',
        boxShadow: 'none'
      },
      contained: {
        boxShadow: 'none'
      }
    },
    MuiPaper: {
      rounded: {
        borderRadius: 0
      }
    }
  }
});

function createPageContext() {
  // We need to define our own custom JSS preset to specify an insertion point for the client
  // This is because CSS-in-JS libs always want to insert styles at the bottom of the <head />, but we want Emotion's styles
  // To have take precedence. See _document.js as well.
  const jss = create(jssPreset());

  if (typeof window !== 'undefined') {
    jss.options.insertionPoint = document.getElementById('jss-insertion-point');
  }

  return {
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    // $FlowFixMe: This is used internally by JSS, so we don't care if Flow complaims about lack of types here
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
    // The standard class name generator.
    generateClassName: createGenerateClassName(),
    jss
  };
}

export default function getPageContext() {
  // Make sure to create a new context for every server-side request so that data
  // isn't shared between connections (which would be bad).
  if (typeof window === 'undefined') {
    return createPageContext();
  }

  // Reuse context on the client-side.
  if (!global.__INIT_MATERIAL_UI__) {
    global.__INIT_MATERIAL_UI__ = createPageContext();
  }

  return global.__INIT_MATERIAL_UI__;
}
