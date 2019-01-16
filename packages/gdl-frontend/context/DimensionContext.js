// @flow
import * as React from 'react';
import { TABLET_BREAKPOINT } from '../style/theme/misc';

const DimensionContext = React.createContext({
  media: 'tablet'
});

class DimensionProvider extends React.PureComponent<
  *,
  { media: 'mobile' | 'tablet' }
> {
  getMediaSize = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined')
      return 'mobile';

    const screenWidth = Math.max(
      document.documentElement ? document.documentElement.clientWidth : 0,
      window.innerWidth || 0
    );
    return screenWidth < TABLET_BREAKPOINT ? 'mobile' : 'tablet';
  };

  state = {
    media: this.getMediaSize()
  };

  onResize = () =>
    window.requestAnimationFrame(() =>
      this.setState({ media: this.getMediaSize() })
    );

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  render() {
    return (
      <DimensionContext.Provider value={{ ...this.state }}>
        {this.props.children}
      </DimensionContext.Provider>
    );
  }
}

export { DimensionProvider, DimensionContext };
