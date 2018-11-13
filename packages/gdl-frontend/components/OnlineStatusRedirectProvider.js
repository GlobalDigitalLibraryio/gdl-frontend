// @flow
import * as React from 'react';
import { withRouter } from 'next/router';
import OnlineStatusContext from './OnlineStatusContext';

/**
 * Watches the user's online status and provides it as context.
 * Redirects to the offline library if deemed necessary
 */
class OnlineStatusRedirectProvider extends React.Component<
  { children: React.Node, router: { push: string => void, route: string } },
  { online: boolean }
> {
  state = {
    online: getStatus()
  };

  handleOnline = () => this.setState({ online: true });

  handleOffline = () => {
    this.setState({ online: false });
    const {
      router,
      router: { route }
    } = this.props;

    if (
      !(
        route === '/books/_read' ||
        route === '/books/_book' ||
        route === '/offline'
      )
    ) {
      router.push('/offline');
    }
  };

  componentDidMount() {
    const online = getStatus();
    if (online !== this.state.online) {
      this.setState({ online });
    }
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  render() {
    return (
      <OnlineStatusContext.Provider value={this.state.online}>
        {this.props.children}
      </OnlineStatusContext.Provider>
    );
  }
}

/**
 * NB! Be wary of using this to assume the user is online. There are many false positives.
 * Should only be used to determine that the user is offline.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine for more information
 *
 */
function getStatus() {
  return typeof window !== 'undefined' && typeof navigator.onLine === 'boolean'
    ? navigator.onLine
    : true;
}

export default withRouter(OnlineStatusRedirectProvider);
