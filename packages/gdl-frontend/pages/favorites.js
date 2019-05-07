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
import type { Favorites, FavoritesVariables } from '../gqlTypes';
import type { intlShape } from 'react-intl';
import {
  getFavoritedBookIds,
  removeFavorite,
  clearFavorites
} from '../lib/favorites';
import BookGrid from '../components/BookGrid';

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

class FavoritesPage extends React.Component<{ intl: intlShape }> {
  handleClearFavorites = (refetch: FavoritesVariables => void) => {
    clearFavorites();
    refetch({ ids: [] });
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
          <Container
            css={{ marginTop: spacing.large, marginBottom: spacing.large }}
          >
            <Typography
              variant="h4"
              component="h1"
              align="center"
              css={{ marginBottom: spacing.large }}
            >
              <FormattedMessage id="Favorites" defaultMessage="Favorites" />
            </Typography>

            <Query
              query={FAVORITES_QUERY}
              variables={{ ids: getFavoritedBookIds() }}
              ssr={false}
              onCompleted={removeBooksNotFound}
            >
              {({
                loading,
                data,
                error,
                refetch
              }: {
                loading: boolean,
                data: Favorites,
                error: any,
                refetch: FavoritesVariables => void
              }) => {
                if (loading || !data) {
                  return (
                    <Center>
                      <CircularProgress />
                    </Center>
                  );
                }

                if (error) {
                  return <div>Something went wrong</div>;
                }
                if (!('books' in data)) return null;

                const books = data.books.filter(Boolean);

                return books.length === 0 ? (
                  <NoFavorites />
                ) : (
                  <>
                    <BookGrid books={books} />
                    <Center>
                      <Button
                        onClick={() => this.handleClearFavorites(refetch)}
                        css={{ marginTop: spacing.large }}
                        variant="outlined"
                        size="small"
                      >
                        <FormattedMessage
                          id="Clear all favorites"
                          defaultMessage="Clear all favorites"
                        />
                      </Button>
                    </Center>
                  </>
                );
              }}
            </Query>
          </Container>
        </Layout>
      </>
    );
  }
}

const NoFavorites = () => (
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
        id="Add books to your favorites so you can easily find them later."
        defaultMessage="Add books to your favorites so you can easily find them later."
      />
    </Typography>
    <Link passHref href="/">
      <Button variant="outlined">
        <FormattedMessage
          id="Find something to read"
          defaultMessage="Find something to read"
        />
      </Button>
    </Link>
  </Center>
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
