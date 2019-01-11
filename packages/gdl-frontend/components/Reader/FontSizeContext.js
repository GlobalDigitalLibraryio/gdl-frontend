// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import * as React from 'react';

const FontSizeContext = React.createContext();

// Extending PureComponent, otherwise we would trigger a render in every consumer every time the provider renders
// (because we are creating objects as the context value)
// See https://reactjs.org/docs/context.html#caveats
class FontSizeProvider extends React.PureComponent<*, { fontSize: number }> {
  changeFontSize = (newFontSize: number) => {
    // We set a lower bound for font size
    if (newFontSize >= 10) {
      this.setState(prev => ({
        fontSize: prev.fontSize >= 10 ? newFontSize : prev.fontSize
      }));
    }
  };

  state = {
    fontSize: 14
  };

  render() {
    return (
      <FontSizeContext.Provider
        value={{
          state: this.state,
          changeFontSize: this.changeFontSize
        }}
      >
        {' '}
        {this.props.children}
      </FontSizeContext.Provider>
    );
  }
}

export { FontSizeProvider, FontSizeContext };
