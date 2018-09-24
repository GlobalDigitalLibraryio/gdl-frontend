// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import type { Book } from '../types';
import { Trans } from '@lingui/react';
import { Typography } from '@material-ui/core';

import { getOfflineBooks } from '../offline';
import Layout from '../components/Layout';
import Head from '../components/Head';
import { Container } from '../elements';
import { spacing } from '../style/theme';
import BookGrid from '../components/BookGrid';

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
    return (
      <>
        <Head title="Offline" />
        <Layout>
          <Container
            css={{ marginTop: spacing.large, marginBottom: spacing.large }}
          >
            <Typography
              variant="headline"
              align="center"
              css={{ marginBottom: spacing.large }}
            >
              <Trans>You appear to be offline</Trans>
            </Typography>
            <BookGrid books={this.state.books} />
          </Container>
        </Layout>
      </>
    );
  }
}

export default OfflinePage;
