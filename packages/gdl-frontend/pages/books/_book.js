// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React, { Fragment } from 'react';
import { Trans } from '@lingui/react';
import NextLink from 'next/link';
import getConfig from 'next/config';
import styled from 'react-emotion';
import {
  Menu,
  MenuItem,
  Button,
  Typography,
  Divider as MuiDivider
} from '@material-ui/core';
import {
  Edit as EditIcon,
  Translate as TranslateIcon,
  Warning as WarningIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteOutlineIcon,
  SaveAlt as SaveAltIcon,
  Share as ShareIcon,
  CheckCircle as CheckCircleIcon
} from '@material-ui/icons';

import { fetchBook, fetchSimilarBooks } from '../../fetch';
import { logEvent } from '../../lib/analytics';
import type { Book, BookDetails, Context, ConfigShape } from '../../types';
import { errorPage } from '../../hocs';
import { Link } from '../../routes';
import Layout from '../../components/Layout';
import Main from '../../components/Layout/Main';
import Head from '../../components/Head';
import { CustomButton, Hidden, View } from '../../elements';
import Container from '../../elements/Container';
import CoverImage from '../../components/CoverImage';
import BookList from '../../components/BookList';
import { hasClaim, claims } from 'gdl-auth';
import { spacing } from '../../style/theme';
import mq from '../../style/mq';
import {
  BookJsonLd,
  Metadata,
  LevelRibbon
} from '../../components/BookDetailsPage';
import Favorite from '../../components/Favorite';

const {
  publicRuntimeConfig: { zendeskUrl }
}: ConfigShape = getConfig();

type Props = {
  book: BookDetails,
  similarBooks: Array<Book>,
  userHasEditAccess: boolean
};

const Divider = styled(MuiDivider)`
  margin: 25px 0;
`;

const MyGrid = styled('div')`
  display: flex;
  width: calc(100% + 40px);
  margin-left: -20px;
  margin-right: -20px;
  ${mq({ flexDirection: ['column', 'row'] })};
`;

const MyGridItem = styled('div')`
  padding-left: 20px;
  padding-right: 20px;
`;

class BookPage extends React.Component<Props> {
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
        <Layout wrapWithMain={false}>
          <Main background="white">
            <Container
              css={{
                paddingLeft: '30px',
                paddingRight: '30px',
                marginTop: '30px'
              }}
              size="large"
            >
              <div>
                <CoverImage
                  css={{ marginLeft: 'auto' }}
                  src={book.coverImage && book.coverImage.url}
                  size="large"
                />
                <LevelRibbon level={book.readingLevel} />
                <Typography
                  lang={book.language.code}
                  variant="h5"
                  component="h1"
                >
                  {book.title}
                </Typography>

                <Typography paragraph variant="subtitle1">
                  <Trans>from {book.publisher.name}</Trans>
                </Typography>

                <Typography lang={book.language.code} paragraph>
                  {book.description}
                </Typography>

                {book.bookFormat === 'HTML' ? (
                  <Link
                    route="read"
                    passHref
                    params={{ id: book.id, lang: book.language.code }}
                    prefetch
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      onClick={() =>
                        logEvent('Books', 'Read', this.props.book.title)
                      }
                    >
                      <Trans>Read book</Trans>
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Button size="large" variant="raised" disabled>
                      <Trans>Read book</Trans>
                    </Button>
                    <Typography
                      align="center"
                      css={{ marginTop: spacing.small }}
                    >
                      This book is only available for download.
                    </Typography>
                  </>
                )}
                <BookActions1 book={book} />
                <Divider />

                <MyGrid>
                  <MyGridItem>
                    <Metadata book={book} />
                  </MyGridItem>
                  <Hidden only="mobile">
                    <MyGridItem>
                      <Divider />
                    </MyGridItem>
                  </Hidden>
                  <MyGridItem>
                    <BookActions2
                      book={book}
                      userHasEditAccess={this.props.userHasEditAccess}
                    />
                  </MyGridItem>
                </MyGrid>

                <Divider />
                <View mb={spacing.medium}>
                  {similarBooks.length > 0 && (
                    <BookList
                      heading={<Trans>Similar</Trans>}
                      books={similarBooks}
                    />
                  )}
                </View>
              </div>
            </Container>
          </Main>
        </Layout>
      </Fragment>
    );
  }
}

/**
 * Favorite, share, offline
 */
class BookActions1 extends React.Component<
  { book: BookDetails },
  { supportsNavigatorShare: boolean }
> {
  state = {
    supportsNavigatorShare: false
  };

  componentDidMount() {
    this.setState({ supportsNavigatorShare: Boolean(!navigator.share) }); // FIXME: Making sure the icon shows now during development. Remember to remove this later
  }

  handleShareClick = () => {
    if (navigator.share) {
      navigator
        .share({
          title: this.props.book.title,
          text: this.props.book.description,
          url: window.location.href
        })
        .then(() => logEvent('Books', 'Shared', this.props.book.title))
        .catch(() => {}); // Ignore here because we don't care if people cancel sharing
    }
  };

  render() {
    const { book } = this.props;
    return (
      <div
        css={{
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '25px'
        }}
      >
        <Favorite
          id={this.props.book.id}
          language={this.props.book.language.code}
        >
          {({ onClick, isFav }) => (
            <CustomButton
              onClick={() => {
                onClick();
                logEvent(
                  'Books',
                  isFav ? 'Unfavorited' : 'Favorited',
                  book.title
                );
              }}
              icon={
                isFav ? (
                  <FavoriteIcon style={isFav ? { color: 'red' } : null} />
                ) : (
                  <FavoriteOutlineIcon />
                )
              }
              label={<Trans>Favorite</Trans>}
            />
          )}
        </Favorite>

        <CustomButton
          icon={<CheckCircleIcon />}
          label={<Trans>Save offline</Trans>}
        />

        {this.state.supportsNavigatorShare && (
          <CustomButton
            icon={<ShareIcon />}
            label={<Trans>Share</Trans>}
            onClick={this.handleShareClick}
          />
        )}
      </div>
    );
  }
}

/**
 * Download, translate, report book
 */
class BookActions2 extends React.Component<
  { book: BookDetails, userHasEditAccess: boolean },
  { anchorEl: ?HTMLElement }
> {
  state = {
    anchorEl: null
  };

  handleDownloadClick = event =>
    this.setState({ anchorEl: event.currentTarget });

  closeDownloadMenu = () => this.setState({ anchorEl: null });

  render() {
    const { book, userHasEditAccess } = this.props;
    return (
      <>
        <Button
          aria-owns={this.state.anchorEl ? 'download-book-menu' : null}
          color="primary"
          aria-haspopup="true"
          onClick={this.handleDownloadClick}
        >
          <SaveAltIcon />
          <Trans>Download</Trans>
        </Button>
        {book.supportsTranslation && (
          <Link
            route="translate"
            passHref
            params={{ id: book.id, lang: book.language.code }}
          >
            <Button
              onClick={() => logEvent('Books', 'Translate', book.title)}
              color="primary"
            >
              <TranslateIcon /> <Trans>Translate this book</Trans>
            </Button>
          </Link>
        )}
        {userHasEditAccess && (
          <NextLink
            href={{
              pathname: '/admin/edit',
              query: { id: book.id, lang: book.language.code }
            }}
            passHref
          >
            <Button color="primary">
              <EditIcon />
              Edit book
            </Button>
          </NextLink>
        )}
        <Button
          color="primary"
          href={zendeskUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => logEvent('Books', 'Report', book.title)}
        >
          <WarningIcon /> <Trans>Report book</Trans>
        </Button>

        <Menu
          id="download-book-menu"
          onClose={this.closeDownloadMenu}
          anchorEl={this.state.anchorEl}
          open={Boolean(this.state.anchorEl)}
        >
          {book.downloads.epub && (
            <MenuItem
              href={book.downloads.epub}
              component="a"
              onClick={() => {
                this.closeDownloadMenu();
                logEvent('Books', 'Downloaded ePub', book.title);
              }}
            >
              <Trans>E-book (EPUB)</Trans>
            </MenuItem>
          )}
          {book.downloads.pdf && (
            <MenuItem
              href={book.downloads.pdf}
              component="a"
              onClick={() => {
                this.closeDownloadMenu();
                logEvent('Books', 'Downloaded PDF', book.title);
              }}
            >
              <Trans>Printable book (PDF)</Trans>
            </MenuItem>
          )}
        </Menu>
      </>
    );
  }
}

export default errorPage(BookPage);
