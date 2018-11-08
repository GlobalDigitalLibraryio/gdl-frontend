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
import { withRouter } from 'next/router';
import Link from 'next/link';
import { Link as RouteLink } from '../routes';

import offlineLibrary from '../lib/offlineLibrary';
import Layout from '../components/Layout';
import Head from '../components/Head';
import { A, Container, Center } from '../elements';
import { spacing } from '../style/theme';
import BookGrid from '../components/BookGrid';

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
        <Head title="Available offline" />
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
                  <OfflineBooks books={books} onPurge={this.handleClear} />
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

const OfflineBooks = withRouter(({ books, onPurge, router }) => (
  <>
    <Typography
      variant="h4"
      component="h1"
      align="center"
      css={{ marginBottom: spacing.large }}
    >
      <Trans>Available offline</Trans>
    </Typography>
    {router.asPath !== '/offline' && (
      <Typography align="center" css={{ marginBottom: spacing.large }}>
        This page is displayed because you appear to be offline. If that is not
        the case, you can click{' '}
        <RouteLink href={router.asPath} passHref>
          <A>here.</A>
        </RouteLink>
      </Typography>
    )}
    <BookGrid books={books} />
    <Center>
      <Button
        onClick={onPurge}
        css={{ marginTop: spacing.large }}
        variant="outlined"
        size="small"
      >
        <Trans>Remove all books</Trans>
      </Button>
    </Center>
  </>
));

const NoOfflineBooks = () => (
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
    <Link passHref href="/">
      <Button variant="outlined">
        <Trans>Find something to read</Trans>
      </Button>
    </Link>
  </Center>
);

export default OfflinePage;
