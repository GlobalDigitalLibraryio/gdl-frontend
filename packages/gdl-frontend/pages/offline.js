// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { Button, CircularProgress, Typography } from '@material-ui/core';
import Link from 'next/link';

import type { intlShape } from 'react-intl';
import type { OfflineBook_book as Book } from '../gqlTypes';
import offlineLibrary from '../lib/offlineLibrary';
import Layout from '../components/Layout';
import Head from '../components/Head';
import { Container, Center } from '../elements';
import { spacing } from '../style/theme';
import BookGrid from '../components/BookGrid';
import OnlineStatusContext, {
  withOnlineStatusContext
} from '../components/OnlineStatusContext';

/**
 * This is the page that we load if we suspect the user is offline (see service-worker.js).
 * The page display's a grid with the books the user has marked as available offline.
 */

type State = {
  books: Array<Book>,
  loadingStatus: 'LOADING' | 'SUCCESS' | 'ERROR'
};

class OfflinePage extends React.Component<{}, State> {
  state = {
    books: [],
    loadingStatus: 'LOADING'
  };

  async componentDidMount() {
    if (!offlineLibrary) return;

    try {
      this.setState({
        books: await offlineLibrary.getBooks(),
        loadingStatus: 'SUCCESS'
      });
    } catch (error) {
      this.setState({ loadingStatus: 'ERROR' });
    }
  }

  handleClear = async () => {
    if (!offlineLibrary) return;

    try {
      await offlineLibrary.clear();
      this.setState({ books: [] });
    } catch (error) {
      this.setState({ loadingStatus: 'ERROR' });
    }
  };

  /**
   * The server side renderer offline page HTML
   * is cached on the client and used as a fallback for page navigation requests when the network can't connect.
   * The default implementation of the OnlineStatusProvider is online=true on the server. The navbar search field
   * is only shown when online. Since we use this page as a fallback when offline, we don't want to show the search field
   * in the inital HTML. So therefore we wrap the content here on the server with a false value
   */
  wrapWithOfflineFromServer(children: React.Node) {
    if (typeof window !== 'undefined') {
      return children;
    }
    return (
      <OnlineStatusContext.Provider value={false}>
        {children}
      </OnlineStatusContext.Provider>
    );
  }

  render() {
    const { loadingStatus, books } = this.state;
    return (
      <>
        <Head title="Offline Library" />
        {this.wrapWithOfflineFromServer(
          <Layout>
            <Container
              css={{ marginTop: spacing.large, marginBottom: spacing.large }}
            >
              {loadingStatus === 'LOADING' && (
                <Center>
                  <CircularProgress />
                </Center>
              )}

              {loadingStatus === 'SUCCESS' && (
                <>
                  {books.length > 0 ? (
                    <OfflineBooks books={books} onClear={this.handleClear} />
                  ) : (
                    <NoOfflineBooks />
                  )}
                </>
              )}
            </Container>
          </Layout>
        )}
      </>
    );
  }
}

const OfflineBooks = ({ books, onClear }) => (
  <>
    <Typography
      variant="h4"
      component="h1"
      align="center"
      css={{ marginBottom: spacing.large }}
    >
      <FormattedMessage id="Offline library" defaultMessage="Offline library" />
    </Typography>
    {/* $FlowFixMe: Apparently Flow doesn't like it if i type BookGrid as Array<Book> | Array<BookDetails> */}
    <BookGrid books={books} />
    <Center>
      <Button
        onClick={onClear}
        css={{ marginTop: spacing.large }}
        variant="outlined"
        size="small"
      >
        <FormattedMessage
          id="Remove all books"
          defaultMessage="Remove all books"
        />
      </Button>
    </Center>
  </>
);

const translations = defineMessages({
  offline: {
    id:
      'Having books available even when you are offline is a great way to make sure you always have something to read',
    defaultMessage:
      'Having books available even when you are offline is a great way to make sure you always have something to read.'
  },
  noBooks: {
    id: 'No books offline yet',
    defaultMessage: 'No books offline yet'
  }
});

const NoOfflineBooks = withOnlineStatusContext(
  injectIntl(({ online, intl }: { online: boolean, intl: intlShape }) => (
    <Center>
      <Typography
        align="center"
        variant="h4"
        component="h1"
        css={{ marginBottom: spacing.large }}
      >
        {intl.formatMessage(translations.noBooks)}
      </Typography>
      <Typography align="center" css={{ marginBottom: spacing.large }}>
        {intl.formatMessage(translations.offline)}
      </Typography>
      {online && (
        <Link passHref href="/">
          <Button variant="outlined">
            <FormattedMessage
              id="Find something to read"
              defaultMessage="Find something to read"
            />
          </Button>
        </Link>
      )}
    </Center>
  ))
);

export default OfflinePage;
