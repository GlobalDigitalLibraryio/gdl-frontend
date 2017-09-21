// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import PropTypes from 'prop-types';

export default class Theme extends React.Component<{}> {
  static childContextTypes = {
    reactIconBase: PropTypes.object,
  };

  getChildContext() {
    return {
      reactIconBase: {
        size: 48,
      },
    };
  }

  render() {
    return <div>hei</div>;
  }
}
