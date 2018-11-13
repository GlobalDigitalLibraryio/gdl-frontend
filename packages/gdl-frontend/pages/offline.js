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
import { withOnlineStatusContext } from '../components/OnlineStatusContext';

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

  render() {
    const { loadingStatus, books } = this.state;
    return (
      <>
        <Head title="Offline Library" />
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
      <Trans>Offline library</Trans>
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
        <Trans>Remove all books</Trans>
      </Button>
    </Center>
  </>
);

const NoOfflineBooks = withOnlineStatusContext(({ online }) => (
  <Center>
    <Typography
      align="center"
      variant="headline"
      component="h1"
      css={{ marginBottom: spacing.large }}
    >
      No books offline yet
    </Typography>
    <Typography align="center" css={{ marginBottom: spacing.large }}>
      Having books available even when you are offline is a great way to make
      sure you always have something to read.
    </Typography>
    {online && (
      <Link passHref href="/">
        <Button variant="outlined">
          <Trans>Find something to read</Trans>
        </Button>
      </Link>
    )}
  </Center>
));

export default OfflinePage;
