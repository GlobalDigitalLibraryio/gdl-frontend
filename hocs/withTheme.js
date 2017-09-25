// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import PropTypes from 'prop-types';

/* eslint-disable react/no-multi-comp */

class Theme extends React.Component<{ children: React.Node }> {
  static childContextTypes = {
    reactIconBase: PropTypes.object,
  };

  getChildContext() {
    return {
      reactIconBase: {
        size: 24,
      },
    };
  }

  render() {
    return this.props.children;
  }
}

/**
 * HoC that wraps a page with Theme
 */
function withTheme(Page: React.ComponentType<any>) {
  return class PageWithTheme extends React.Component<any> {
    static getInitialProps(context) {
      if (typeof Page.getInitialProps === 'function') {
        return Page.getInitialProps(context);
      }
      return undefined;
    }

    render() {
      return (
        <Theme>
          <Page {...this.props} />
        </Theme>
      );
    }
  };
}

export { Theme, withTheme as default };
