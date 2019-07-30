// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import {
  Avatar,
  Button,
  Typography,
  CircularProgress
} from '@material-ui/core';
import { FavoriteBorder as FavoriteBorderIcon } from '@material-ui/icons';
import Link from 'next/link';

import Layout from '../components/Layout';
import Head from '../components/Head';
import { Container, Center } from '../elements';
import { spacing } from '../style/theme';
import type { Favorites } from '../gqlTypes';
import type { intlShape } from 'react-intl';
import {
  getFavoritedBookIds,
  removeFavorite,
  clearFavorites
} from '../lib/favorites';
import BookGrid from '../components/BookGrid';
import EditBooks from '../components/EditBookLibrary/EditBooks';

/**
 * If we have favorited books that we are unable to get from the server
 * we cleanup by deleting the not found ones
 */

function removeBooksNotFound(data: Favorites) {
  if (!('books' in data)) return null;

  const favoritedIds = getFavoritedBookIds();

  const foundFavoriteIds = data.books.filter(Boolean).map(b => b.id);

  const diff = favoritedIds.filter(id => !foundFavoriteIds.includes(id));
  diff.forEach(removeFavorite);
}

type State = {
  editMode: boolean,
  selectedBooks: Array<string>,
  openDialog: boolean,
  selectAll: number
};

class FavoritesPage extends React.Component<
  {
    intl: intlShape
  },
  State
> {
  state = {
    editMode: false,
    selectedBooks: [],
    openDialog: false,
    selectAll: 2
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

  changeActive = () => {
    this.state.selectedBooks.length === getFavoritedBookIds().length
      ? this.setState({ selectAll: 1 })
      : this.setState({ selectAll: 2 });
  };
  selectAllBooks = () => {
    this.state.selectedBooks.length === getFavoritedBookIds().length
      ? this.setState({ selectAll: 0, selectedBooks: [] })
      : this.setState({
          selectAll: 1,
          selectedBooks: getFavoritedBookIds().map(book => book)
        });
  };

  deselectAllBooks = () => {
    this.setState({ selectAll: 0, selectedBooks: [] });
  };

  deleteSelected = async () => {
    if (this.state.selectedBooks.length !== getFavoritedBookIds().length) {
      this.state.selectedBooks.forEach(book => {
        removeFavorite(book);
      });
    } else {
      clearFavorites();
    }
    this.openCloseEditMode();
  };

  render() {
    const { intl } = this.props;
    return (
      <>
        <Head
          title={intl.formatMessage({
            id: 'Favorites',
            defaultMessage: 'Favorites'
          })}
        />
        <Layout>
          <Query
            query={FAVORITES_QUERY}
            variables={{ ids: getFavoritedBookIds() }}
            ssr={false}
            onCompleted={removeBooksNotFound}
          >
            {({
              loading,
              data,
              error
            }: {
              loading: boolean,
              data: Favorites,
              error: any
            }) => {
              if (loading || !data) {
                return (
                  <Container
                    css={{
                      marginTop: spacing.large,
                      marginBottom: spacing.large
                    }}
                  >
                    <Center>
                      <CircularProgress />
                    </Center>
                  </Container>
                );
              }

              if (error) {
                return <div>Something went wrong</div>;
              }
              if (!('books' in data)) {
                return null;
              }

              const books = data.books.filter(Boolean);

              return books.length > 0 ? (
                this.state.editMode ? (
                  <>
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
                      favorites={true}
                    />
                  </>
                ) : (
                  <FavoriteBooks
                    books={books}
                    onClick={() => this.openCloseEditMode()}
                  />
                )
              ) : (
                <NoFavorites />
              );
            }}
          </Query>
        </Layout>
      </>
    );
  }
}

const FavoriteBooks = ({ books, onClick }) => (
  <Container
    css={{
      marginTop: spacing.large,
      marginBottom: spacing.large
    }}
  >
    <Typography
      variant="h4"
      component="h1"
      align="center"
      css={{ marginBottom: spacing.large }}
    >
      <FormattedMessage id="Favorites" defaultMessage="Favorites" />
    </Typography>

    <BookGrid books={books} />
    <Center>
      <Button
        onClick={onClick}
        css={{ marginTop: spacing.large }}
        color="primary"
        variant="contained"
        size="small"
      >
        <FormattedMessage id="Edit favorites" defaultMessage="Edit favorites" />
      </Button>
    </Center>
  </Container>
);

const NoFavorites = () => (
  <Container
    css={{
      marginTop: spacing.large,
      marginBottom: spacing.large
    }}
  >
    <Typography
      variant="h4"
      component="h1"
      align="center"
      css={{ marginBottom: spacing.large }}
    >
      <FormattedMessage id="Favorites" defaultMessage="Favorites" />
    </Typography>

    <Center>
      <Avatar css={{ height: 100, width: 100 }}>
        <FavoriteBorderIcon css={{ color: 'red', fontSize: 70 }} />
      </Avatar>
      <Typography
        align="center"
        css={{
          marginTop: spacing.large,
          marginBottom: spacing.medium
        }}
      >
        <FormattedMessage
          id="Add favorite books"
          defaultMessage="Add books to your favorites so you can easily find them later."
        />
      </Typography>
      <Link passHref href="/">
        <Button variant="contained" color="primary">
          <FormattedMessage
            id="Find something to read"
            defaultMessage="Find something to read"
          />
        </Button>
      </Link>
    </Center>
  </Container>
);

const FAVORITES_QUERY = gql`
  query Favorites($ids: [ID!]!) {
    books(ids: $ids) {
      id
      bookId
      title
      language {
        code
      }
      coverImage {
        url
      }
    }
  }
`;

export default injectIntl(FavoritesPage);
