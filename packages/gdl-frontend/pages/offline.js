// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import type { BookDetails } from '../types';
import { Trans } from '@lingui/react';
import { Button, CircularProgress, Typography } from '@material-ui/core';
import Link from 'next/link';

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
  books: Array<BookDetails>,
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
  wrapWithOfflineFromServer(children) {
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
      <Trans>បណ្ណាល័យក្រៅបណ្តាញ</Trans>
    </Typography>
    {/* $FlowFixMe: Apparently Flow doesn't like it if i type BookGrid as Array<Book> | Array<BookDetails> */}
    <BookGrid books={books} />
    <Center>
      <Button
        onClick={onClear}
        css={{ marginTop: spacing.large }}
        variant="outlined"
        size="small"
        color="primary"
      >
        <Trans>យកសៀវភៅទាំងអស់ចេញ</Trans>
      </Button>
    </Center>
  </>
);

const NoOfflineBooks = withOnlineStatusContext(({ online }) => (
  <Center>
    <Typography
      align="center"
      variant="h4"
      component="h1"
      css={{ marginBottom: spacing.large }}
    >
      មិនមានសៀវភៅនៅក្រៅអ៊ីនធឺណិត
    </Typography>
    <Typography align="center" css={{ marginBottom: spacing.large }}>
      ការមានសៀវភៅដែលអាចរកបានសូម្បីតែពេលអ្នកនៅក្រៅអ៊ីនធឺណិតគឺជាមធ្យោបាយដ៏ល្អមួយដើម្បីប្រាកដថាអ្នកមានអ្វីដែលអ្នកត្រូវអានជានិច្ច។
    </Typography>
    {online && (
      <Link passHref href="/">
        <Button variant="outlined" color="primary">
          <Trans>រកឃើញអ្វីដែលត្រូវអាន</Trans>
        </Button>
      </Link>
    )}
  </Center>
));

export default OfflinePage;
