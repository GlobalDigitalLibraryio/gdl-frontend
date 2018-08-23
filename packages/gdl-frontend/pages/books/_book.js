// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React, { Fragment } from 'react';
import { Trans } from '@lingui/react';
import getConfig from 'next/config';
import { Button, Divider } from '@material-ui/core';
import {
  Translate as TranslateIcon,
  Warning as WarningIcon
} from '@material-ui/icons';

import { fetchBook, fetchSimilarBooks } from '../../fetch';
import { logEvent } from '../../lib/analytics';
import type { Book, BookDetails, Context, ConfigShape } from '../../types';
import { errorPage } from '../../hocs';
import { Link } from '../../routes';
import Layout from '../../components/Layout';
import Head from '../../components/Head';
import { View } from '../../elements';
import Container from '../../elements/Container';
import BookList from '../../components/BookList';
import { hasClaim, claims } from 'gdl-auth';
import { colors, spacing } from '../../style/theme';
import {
  BookJsonLd,
  Metadata,
  BookHero
} from '../../components/BookDetailsPage';

const {
  publicRuntimeConfig: { zendeskUrl }
}: ConfigShape = getConfig();

type Props = {
  book: BookDetails,
  similarBooks: Array<Book>,
  userHasEditAccess: boolean
};

const BORDER_STYLE = `1px solid ${colors.base.grayLight}`;

class BookPage extends React.Component<
  Props,
  { anchorEl: ?HTMLElement, supportsNavigatorShare: boolean }
> {
  state = {
    anchorEl: null,
    supportsNavigatorShare: false
  };

  static async getInitialProps({ query, req }: Context) {
    const [bookRes, similarRes] = await Promise.all([
      fetchBook(query.id, query.lang),
      fetchSimilarBooks(query.id, query.lang)
    ]);

    if (!bookRes.isOk) {
      return {
        statusCode: bookRes.statusCode
      };
    }

    return {
      book: bookRes.data,
      userHasEditAccess: hasClaim(claims.writeBook, req),
      // Don't let similar books crash the page
      similarBooks: similarRes.isOk ? similarRes.data.results : []
    };
  }

  handleDownloadClick = event =>
    this.setState({ anchorEl: event.currentTarget });

  closeDownloadMenu = () => this.setState({ anchorEl: null });

  handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: this.props.book.title,
        text: this.props.book.description,
        url: window.location.href
      });
    }
  };

  render() {
    const { similarBooks, book } = this.props;

    return (
      <Fragment>
        <Head
          description={book.description}
          title={book.title}
          image={book.coverImage && book.coverImage.url}
        >
          <BookJsonLd book={book} />
        </Head>
        <Layout category={book.category}>
          <BookHero
            book={this.props.book}
            userHasEditAccess={this.props.userHasEditAccess}
          />

          <Container mt={spacing.medium}>
            <Metadata book={book} />
            {book.supportsTranslation && (
              <View borderTop={BORDER_STYLE} mt={spacing.medium}>
                <Link
                  route="translate"
                  passHref
                  params={{ id: book.id, lang: book.language.code }}
                >
                  <Button
                    onClick={() => logEvent('Books', 'Translate', book.title)}
                    color="primary"
                    css={{ margin: `${spacing.medium} 0` }}
                  >
                    <TranslateIcon /> <Trans>Translate this book</Trans>
                  </Button>
                </Link>
              </View>
            )}
            <View
              borderTop={BORDER_STYLE}
              mt={book.supportsTranslation ? 0 : spacing.medium}
            >
              <Button
                color="primary"
                css={{ margin: `${spacing.medium} 0` }}
                href={zendeskUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => logEvent('Books', 'Report', book.title)}
              >
                <WarningIcon /> <Trans>Report a problem with this book</Trans>
              </Button>
            </View>
          </Container>

          <Container>
            <Divider />
            <View mb={spacing.medium} pt={spacing.medium}>
              {similarBooks.length > 0 && (
                <BookList
                  heading={<Trans>Similar</Trans>}
                  books={similarBooks}
                />
              )}
            </View>
          </Container>
        </Layout>
      </Fragment>
    );
  }
}

export default errorPage(BookPage);
