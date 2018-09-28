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

import { getOfflineBooks } from '../lib/offline';
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
    try {
      this.setState({
        books: await getOfflineBooks(),
        loadingStatus: 'SUCCESS'
      });
    } catch (error) {
      this.setState({ loadingStatus: 'ERROR' });
    }
  }

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
                  <OfflineBooks books={books} />
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

const OfflineBooks = withRouter(({ books, router }) => (
  <>
    <Typography
      variant="headline"
      align="center"
      css={{ marginBottom: spacing.medium }}
    >
      <Trans>Available offline</Trans>
    </Typography>
    {router.asPath !== '/offline' && (
      <Typography align="center" css={{ marginBottom: spacing.large }}>
        You are shown this page because you appear to be offline. If that is not
        the case, you can click{' '}
        <RouteLink href={router.asPath} passHref>
          <A>here.</A>
        </RouteLink>
      </Typography>
    )}
    <BookGrid books={books} />
  </>
));

const NoOfflineBooks = () => (
  <Center>
    <Typography
      align="center"
      variant="headline"
      css={{ marginBottom: spacing.medium }}
    >
      No books offline yet...
    </Typography>
    <Typography align="center" css={{ marginBottom: spacing.medium }}>
      Having books available even you're offline is a great way to make sure you
      always have something to read.
    </Typography>
    <Link passHref href="/">
      <Button variant="outlined">
        <Trans>Find something to read</Trans>
      </Button>
    </Link>
  </Center>
);

export default OfflinePage;
