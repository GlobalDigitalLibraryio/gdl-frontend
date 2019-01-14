// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import * as React from 'react';

const INTERVAL = 2;

type ContextState = {
  fontSize: number,
  increaseFontSize: () => void,
  decreaseFontSize: () => void
};

const FontSizeContext = React.createContext<ContextState>({
  fontSize: 14,
  increaseFontSize: () => {},
  decreaseFontSize: () => {}
});

// Extending PureComponent, otherwise we would trigger a render in every consumer every time the provider renders
// (because we are creating objects as the context value)
// See https://reactjs.org/docs/context.html#caveats
class FontSizeProvider extends React.PureComponent<*, { fontSize: number }> {
  increaseFontSize = () =>
    this.setState(prev => ({
      fontSize: prev.fontSize >= 10 ? prev.fontSize + INTERVAL : prev.fontSize
    }));

  decreaseFontSize = () =>
    this.setState(prev => ({
      fontSize: prev.fontSize >= 10 ? prev.fontSize - INTERVAL : prev.fontSize
    }));

  state = {
    fontSize: 14
  };

  render() {
    return (
      <FontSizeContext.Provider
        value={{
          fontSize: this.state.fontSize,
          increaseFontSize: this.increaseFontSize,
          decreaseFontSize: this.decreaseFontSize
        }}
      >
        {this.props.children}
      </FontSizeContext.Provider>
    );
  }
}

export { FontSizeProvider, FontSizeContext };
