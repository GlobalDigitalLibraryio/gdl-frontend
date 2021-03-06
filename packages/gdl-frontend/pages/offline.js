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

type State = {
  books: Array<Book>,
  loadingStatus: 'LOADING' | 'SUCCESS' | 'ERROR',
  editMode: boolean,
  selectedBooks: Array<string>,
  openDialog: boolean,
  selectAll: boolean
};

class OfflinePage extends React.Component<{}, State> {
  state = {
    books: [],
    loadingStatus: 'LOADING',
    editMode: false,
    selectedBooks: [],
    openDialog: false,
    selectAll: false
  };

  changeActive = () => {
    this.state.selectedBooks.length === this.state.books.length
      ? this.setState({ selectAll: true })
      : this.setState({ selectAll: false });
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
      openDialog: false
    });
  };

  openCloseDialog = () => {
    if (this.state.selectedBooks.length > 0) {
      this.setState({ openDialog: !this.state.openDialog });
    }
  };

  selectAllBooks = () => {
    this.state.selectedBooks.length === this.state.books.length
      ? this.setState({
          selectAll: false,
          selectedBooks: []
        })
      : this.setState({
          selectAll: true,
          selectedBooks: this.state.books.map(book => book.id)
        });
  };

  deselectAllBooks = () => {
    this.setState({
      selectAll: false,
      selectedBooks: []
    });
  };

  deleteSelected = async () => {
    if (!offlineLibrary) return;

    if (this.state.selectedBooks.length !== this.state.books.length) {
      try {
        this.state.selectedBooks.forEach(async bookId => {
          const book = this.state.books.find(book => book.id === bookId);
          this.state.books.splice(this.state.books.indexOf(book), 1);
          await offlineLibrary.deleteBook(bookId);
        });
      } catch (error) {
        this.setState({ loadingStatus: 'ERROR' });
      }
    } else {
      this.handleClear();
    }
    this.openCloseEditMode();
  };

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
                      deselectAllBooks={this.deselectAllBooks}
                      changeActive={this.changeActive.bind(this)}
                      favorites={false}
                      selectAll={this.state.selectAll}
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
      <BookGrid books={books} />
      <Center>
        <Button
          onClick={onClick}
          css={{ marginTop: spacing.large }}
          variant="contained"
          color="primary"
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
            <Button variant="contained" color="primary">
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
