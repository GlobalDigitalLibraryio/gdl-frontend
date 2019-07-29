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
import EditBooks from '../components/EditBookLibrary/EditBooks';

/**
 * This is the page that we load if we suspect the user is offline (see service-worker.js).
 * The page display's a grid with the books the user has marked as available offline.
 */

type State = {
  books: Array<Book>,
  loadingStatus: 'LOADING' | 'SUCCESS' | 'ERROR',
  editMode: boolean,
  selectedBooks: Array<string>,
  openDialog: boolean,
  selectAll: number
};

class OfflinePage extends React.Component<{}, State> {
  state = {
    books: [],
    loadingStatus: 'LOADING',
    editMode: false,
    selectedBooks: [],
    openDialog: false,
    selectAll: 2
  };

  changeActive = () => {
    this.state.selectedBooks.length === this.state.books.length
      ? this.setState({ selectAll: 1 })
      : this.setState({ selectAll: 2 });
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

  openCloseEditMode = () => {
    this.setState({
      editMode: !this.state.editMode,
      selectedBooks: [],
      openDialog: false,
      selectAll: 0
    });
  };

  openCloseDialog = () => {
    if (this.state.selectedBooks.length > 0) {
      this.setState({ openDialog: !this.state.openDialog });
    }
  };

  selectAllBooks = () => {
    this.state.selectedBooks.length === this.state.books.length
      ? this.setState({ selectAll: 0, selectedBooks: [] })
      : this.setState({
          selectAll: 1,
          selectedBooks: this.state.books.map(book => book.id)
        });
  };

  deselectAllBooks = () => {
    this.setState({ selectAll: 0, selectedBooks: [] });
  };

  deleteSelected = async () => {
    if (!offlineLibrary) return;

    if (this.state.selectedBooks.length !== this.state.books.length) {
      try {
        for (let i = 0; i < this.state.selectedBooks.length; i++) {
          await offlineLibrary.deleteBook(this.state.selectedBooks[i]);
          const book = this.state.books.find(
            book => book.id === this.state.selectedBooks[i]
          );
          this.state.books.splice(this.state.books.indexOf(book), 1);
        }
      } catch (error) {
        this.setState({ loadingStatus: 'ERROR' });
      }
    } else {
      this.handleClear();
    }
    this.openCloseEditMode();
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
            {/* <Container
              css={{ marginTop: spacing.large, marginBottom: spacing.large }}
            > */}
            {loadingStatus === 'LOADING' && (
              <Container
                css={{ marginTop: spacing.large, marginBottom: spacing.large }}
              >
                <Center>
                  <CircularProgress />
                </Center>
              </Container>
            )}
            {loadingStatus === 'SUCCESS' && (
              <>
                {books.length > 0 ? (
                  this.state.editMode ? (
                    <EditBooks
                      books={books}
                      onClick={this.openCloseEditMode}
                      selectedBooks={this.state.selectedBooks}
                      onDelete={this.deleteSelected}
                      dialog={this.openCloseDialog}
                      open={this.state.openDialog}
                      selectAllBooks={this.selectAllBooks}
                      selectAll={this.state.selectAll}
                      deselectAllBooks={this.deselectAllBooks}
                      changeActive={this.changeActive.bind(this)}
                      favorites={false}
                    />
                  ) : (
                    <OfflineBooks
                      books={books}
                      onClick={this.openCloseEditMode}
                    />
                  )
                ) : (
                  <NoOfflineBooks />
                )}
              </>
            )}
            {/*             </Container>
             */}{' '}
          </Layout>
        )}
      </>
    );
  }
}

const OfflineBooks = ({ books, onClick }) => (
  <>
    <Container css={{ marginTop: spacing.large, marginBottom: spacing.large }}>
      <Typography
        variant="h4"
        component="h1"
        align="center"
        css={{ marginBottom: spacing.large }}
      >
        <FormattedMessage
          id="Offline library"
          defaultMessage="Offline library"
        />
      </Typography>
      {/* $FlowFixMe: Apparently Flow doesn't like it if i type BookGrid as Array<Book> | Array<BookDetails> */}
      <BookGrid books={books} />
      <Center>
        <Button
          onClick={onClick}
          css={{ marginTop: spacing.large }}
          variant="outlined"
          size="small"
        >
          <FormattedMessage
            id="Edit offline library"
            defaultMessage="Edit offline library"
          />
        </Button>
      </Center>
    </Container>
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
    <Container css={{ marginTop: spacing.large, marginBottom: spacing.large }}>
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
    </Container>
  ))
);

export default OfflinePage;
