// @flow
import * as React from 'react';
import { withRouter } from 'next/router';
import offlineLibrary from '../lib/offlineLibrary';
import OnlineStatusContext from './OnlineStatusContext';

/**
 * Watches the user's online status and provides it as context.
 * Redirects to the offline library if deemed necessary
 */
class OnlineStatusRedirectProvider extends React.Component<
  {
    children: React.Node,
    router: {
      replace: string => void,
      route: string,
      query: { id?: string, lang?: string }
    }
  },
  { online: boolean }
> {
  state = {
    online: getStatus()
  };

  handleOnline = () => this.setState({ online: true });

  /**
   * When we go offline, we redirect to the offline library page (unless we are at a book that is already offlined)
   */
  handleOffline = async () => {
    // Only redirect to the offline page if we have proper offline support (We don't want to redirect in IE for instance)
    if (!offlineLibrary) {
      return;
    }

    this.setState({ online: false });
    const {
      router,
      router: { route, query }
    } = this.props;

    if (
      (route === '/books/_read' || route === '/books/_book') &&
      query.id &&
      query.lang
    ) {
      const book = await offlineLibrary.getBook(query.id, query.lang);
      if (!book) {
        router.replace('/offline');
      }
    } else if (route !== '/offline') {
      router.replace('/offline');
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
  return typeof window !== 'undefined' &&
    typeof navigator.onLine === 'boolean' &&
    offlineLibrary
    ? navigator.onLine
    : true;
}

export default withRouter(OnlineStatusRedirectProvider);
