// @flow
import * as React from 'react';

function getStatus() {
  return typeof window !== 'undefined' && typeof navigator.onLine === 'boolean'
    ? navigator.onLine
    : true;
}

/**
 * NB! Be wary of using this to assume the user is online. There are many false positives.
 * Should only be used to determine that the user is offline.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine for more information
 *
 */
export default class OnlineStatus extends React.Component<
  { children: boolean => React.Node },
  { online: boolean }
> {
  state = {
    online: getStatus()
  };

  handleOnline = () => this.setState({ online: true });
  handleOffline = () => this.setState({ online: false });

  componentDidMount() {
    this.setState({ online: getStatus() });
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  render() {
    return this.props.children(this.state.online);
  }
}
