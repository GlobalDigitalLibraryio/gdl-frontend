// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { Trans } from '@lingui/react';
import NextLink from 'next/link';
import getConfig from 'next/config';
import styled from 'react-emotion';
import copyToClipboard from 'copy-to-clipboard';
import { coverImageUrl } from 'gdl-image';
import {
  Snackbar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
  Typography,
  Divider as MuiDivider,
  NoSsr
} from '@material-ui/core';
import {
  Edit as EditIcon,
  Translate as TranslateIcon,
  Warning as WarningIcon,
  SaveAlt as SaveAltIcon,
  Share as ShareIcon,
  Link as LinkIcon
} from '@material-ui/icons';
import { FacebookIcon, TwitterIcon } from '../../components/icons';

import OnlineContext from '../../components/OnlineStatusContext';
import offlineLibrary from '../../lib/offlineLibrary';
import { fetchBook, fetchSimilarBooks } from '../../fetch';
import { logEvent } from '../../lib/analytics';
import type { Book, BookDetails, Context, ConfigShape } from '../../types';
import { withErrorPage } from '../../hocs';
import { Link } from '../../routes';
import Layout from '../../components/Layout';
import Main from '../../components/Layout/Main';
import Head from '../../components/Head';
import { Container, IconButton, Hidden, View } from '../../elements';
import CoverImage from '../../components/CoverImage';
import BookList from '../../components/BookList';
import { hasClaim, claims } from 'gdl-auth';
import { spacing, misc } from '../../style/theme';
import mq from '../../style/mq';
import media from '../../style/media';
import {
  BookJsonLd,
  Metadata,
} from '../../components/BookDetailsPage';
import Favorite, { FavoriteIcon } from '../../components/Favorite';
import LevelRibbon from '../../components/Level/LevelRibbon';
import OfflineIcon from '../../components/OfflineIcon';

const {
  publicRuntimeConfig: { zendeskUrl }
}: ConfigShape = getConfig();

type Props = {
  book: BookDetails,
  similarBooks: Array<Book>,
  userHasEditAccess: boolean
};

const Divider = styled(MuiDivider)`
  margin: ${spacing.large} 0;
  ${media.tablet`
  margin: ${spacing.xxlarge} 0;
  `};
`;

const Grid = styled('div')(
  media.tablet`
    display: flex;
    width: calc(100% + 40px);
    margin-left: -20px;
    margin-right: -20px;
  `
);

const GridItem = styled('div')(
  media.tablet`
  flex-grow: 1;
  padding-left: 20px;
  padding-right: 20px;
 `
);

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

  static contextType = OnlineContext;

  render() {
    const { similarBooks, book } = this.props;
    const offline: boolean = !this.context;

    return (
      <>
        <Head
          description={book.description}
          title={book.title}
          image={book.coverImage && coverImageUrl(book.coverImage)}
        >
          <BookJsonLd book={book} />
        </Head>
        <Layout wrapWithMain={false}>
          <Main background="white" css={mq({ marginTop: [200, 100] })}>
            <Container css={mq({ marginTop: [-160, -54] })}>
              <div>
                <Grid>
                  <GridItem css={media.tablet`flex: 0 0 310px;`}>
                    <CoverImage
                      css={{ marginLeft: 'auto' }}
                      coverImage={book.coverImage}
                      size="large"
                    />
                    <Hidden only="tablet" css={{ marginTop: spacing.xxlarge }}>
                      <ReadBookLink book={book} />
                    </Hidden>
                    <Hidden
                      only="mobile"
                      css={{ marginTop: -20, marginBottom: spacing.medium }}
                    >
                      <LevelRibbon level={book.readingLevel} />
                    </Hidden>
                  </GridItem>
                  <GridItem>
                    <Hidden
                      only="tablet"
                      css={{
                        marginTop: 120,
                        marginBottom: 45
                      }}
                    >
                      <div
                        css={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%'
                        }}
                      >
                        <LevelRibbon level={book.readingLevel} />
                        <BookActions1 book={book} key={book.uuid} />
                      </div>
                    </Hidden>
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
                    <Hidden only="mobile">
                      <ReadBookLink book={book} />
                    </Hidden>
                  </GridItem>
                </Grid>
                <Hidden only="mobile" css={{ marginTop: spacing.large }}>
                  <BookActions1 book={book} key={book.uuid} />
                </Hidden>
                <Divider />

                <Grid>
                  <GridItem>
                    <Metadata book={book} />
                  </GridItem>
                  <Hidden only="mobile">
                    <GridItem>
                      <Divider />
                    </GridItem>
                  </Hidden>
                  <GridItem css={media.tablet`flex: 0 0 310px; order: -1;`}>
                    <BookActions2
                      book={book}
                      userHasEditAccess={this.props.userHasEditAccess}
                    />
                  </GridItem>
                </Grid>

                <Divider />
                {!offline && similarBooks.length > 0 && (
                  <View mb={spacing.medium}>
                    <BookList
                      heading={<Trans>Similar</Trans>}
                      books={similarBooks}
                    />
                  </View>
                )}
              </div>
            </Container>
          </Main>
        </Layout>
      </>
    );
  }
}

const ReadBookLink = ({ book }) =>
  book.bookFormat === 'HTML' ? (
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
        onClick={() => logEvent('Books', 'Read', book.title)}
      >
        <Trans>Read book</Trans>
      </Button>
    </Link>
  ) : (
    <>
      <Button size="large" variant="raised" disabled fullWidth>
        <Trans>Read book</Trans>
      </Button>
      <Typography
        align="center"
        css={{ marginTop: spacing.small }}
        variant="caption"
      >
        This book is only available for download.
      </Typography>
    </>
  );

/**
 * Favorite, share, offline
 * Remember to render this with a key prop, easier to just blow away the entire component than handling
 * updated props
 */
class BookActions1 extends React.Component<
  { book: BookDetails },
  {
    anchorEl: ?HTMLElement,
    isAvailableOffline: ?'NO' | 'YES' | 'DOWNLOADING',
    snackbarMessage: ?string
  }
> {
  state = {
    anchorEl: null,
    isAvailableOffline: null,
    snackbarMessage: null
  };

  static contextType = OnlineContext;

  async componentDidMount() {
    if (!offlineLibrary) return;

    const offlineBook = await offlineLibrary.getBook(
      this.props.book.id,
      this.props.book.language.code
    );

    this.setState({
      isAvailableOffline: Boolean(offlineBook) ? 'YES' : 'NO'
    });
  }

  closeShareMenu = () => this.setState({ anchorEl: null });

  handleShareClick = event => {
    /**
     * If the browser supports the web share api, we use that instead of displaying a dropdown
     */
    if (navigator.share) {
      navigator
        .share({
          title: this.props.book.title,
          text: this.props.book.description,
          url: window.location.href
        })
        .then(() => logEvent('Books', 'Shared', this.props.book.title))
        .catch(() => {}); // Ignore here because we don't care if people cancel sharing
    } else {
      this.setState({ anchorEl: event.currentTarget });
    }
  };

  handleOfflineClick = async () => {
    if (!offlineLibrary) return;

    const { book } = this.props;

    this.setState({ isAvailableOffline: 'DOWNLOADING' });

    if (this.state.isAvailableOffline === 'YES') {
      await offlineLibrary.deleteBook(book.id, book.language.code);
      this.setState({
        isAvailableOffline: 'NO',
        snackbarMessage: 'Removed book from your offline library.'
      });
      logEvent('Books', 'Remove offline', book.title);
    } else {
      const offlinedBook = await offlineLibrary.addBook(book);
      this.setState({
        isAvailableOffline: offlinedBook ? 'YES' : 'NO',
        snackbarMessage: offlinedBook
          ? 'Added book to your offline library.'
          : 'An error occurred while adding this book to your offline library.'
      });
      logEvent('Books', 'Available offline', book.title);
    }
  };

  render() {
    const { book } = this.props;
    const offline: boolean = !this.context;
    return (
      <>
        <div
          css={{
            display: 'flex',
            justifyContent: 'space-around',
            width: '100%'
          }}
        >
          <Favorite
            id={this.props.book.id}
            language={this.props.book.language.code}
          >
            {({ onClick, isFav }) => (
              <IconButton
                // Moving the fav button up top on mobile
                css={media.mobile`position: absolute; top: 0; left: ${
                  misc.gutter
                }px;`}
                onClick={() => {
                  onClick();
                  logEvent(
                    'Books',
                    isFav ? 'Unfavorited' : 'Favorited',
                    book.title
                  );
                }}
                icon={<FavoriteIcon filled={isFav} />}
                label={<Trans>Favorite</Trans>}
              />
            )}
          </Favorite>

          <NoSsr>
            {offlineLibrary && (
              <IconButton
                isLoading={this.state.isAvailableOffline === 'DOWNLOADING'}
                icon={
                  <OfflineIcon
                    filled={this.state.isAvailableOffline === 'YES'}
                  />
                }
                onClick={this.handleOfflineClick}
                label={<Trans>Save offline</Trans>}
              />
            )}
          </NoSsr>

          {!offline && (
            <IconButton
              icon={<ShareIcon />}
              label={<Trans>Share</Trans>}
              onClick={this.handleShareClick}
            />
          )}
        </div>
        <Menu
          id="share-book-menu"
          onClose={this.closeShareMenu}
          anchorEl={this.state.anchorEl}
          open={Boolean(this.state.anchorEl)}
        >
          <MenuItem
            rel="noopener noreferrer"
            target="_blank"
            href={`https://www.facebook.com/sharer.php?u=${
              typeof window !== 'undefined' ? window.location.href : ''
            }`}
            component="a"
            onClick={this.closeShareMenu}
          >
            <ListItemIcon>
              <FacebookIcon />
            </ListItemIcon>
            <ListItemText>Facebook</ListItemText>
          </MenuItem>
          <MenuItem
            rel="noopener noreferrer"
            target="_blank"
            href={`https://twitter.com/intent/tweet?url=${
              typeof window !== 'undefined' ? window.location.href : ''
            }`}
            component="a"
            onClick={this.closeShareMenu}
          >
            <ListItemIcon>
              <TwitterIcon />
            </ListItemIcon>
            <ListItemText>Twitter</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              copyToClipboard(window.location.href);
              this.closeShareMenu();
            }}
            component="button"
          >
            <ListItemIcon>
              <LinkIcon />
            </ListItemIcon>
            <ListItemText>
              <Trans>Copy URL</Trans>
            </ListItemText>
          </MenuItem>
        </Menu>
        {/* Show offlined snackbar*/}
        <Snackbar
          autoHideDuration={3000}
          open={Boolean(this.state.snackbarMessage)}
          onClose={() => this.setState({ snackbarMessage: null })}
          ContentProps={{
            'aria-describedby': 'message-id'
          }}
          message={
            <span id="snackbar-message">{this.state.snackbarMessage}</span>
          }
        />
      </>
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

  static contextType = OnlineContext;

  handleDownloadClick = event =>
    this.setState({ anchorEl: event.currentTarget });

  closeDownloadMenu = () => this.setState({ anchorEl: null });

  render() {
    const { book, userHasEditAccess } = this.props;
    const offline: boolean = !this.context;
    return (
      <>
        <div>
          <Button
            aria-owns={this.state.anchorEl ? 'download-book-menu' : null}
            color="primary"
            aria-haspopup="true"
            onClick={this.handleDownloadClick}
            disabled={offline}
          >
            <SaveAltIcon css={{ marginRight: spacing.xsmall }} />
            <Trans>Download</Trans>
          </Button>
        </div>

        {book.supportsTranslation && (
          <div>
            <Link
              route="translate"
              passHref
              params={{ id: book.id, lang: book.language.code }}
            >
              <Button
                onClick={() => logEvent('Books', 'Translate', book.title)}
                color="primary"
                disabled={offline}
              >
                <TranslateIcon css={{ marginRight: spacing.xsmall }} />{' '}
                <Trans>Translate this book</Trans>
              </Button>
            </Link>
          </div>
        )}
        {userHasEditAccess && (
          <div>
            <NextLink
              href={{
                pathname: '/admin/edit/book',
                query: { id: book.id, lang: book.language.code }
              }}
              passHref
            >
              <Button color="primary" disabled={offline}>
                <EditIcon css={{ marginRight: spacing.xsmall }} />
                Edit
              </Button>
            </NextLink>
          </div>
        )}
        <div>
          <Button
            color="primary"
            href={zendeskUrl}
            target="_blank"
            rel="noopener noreferrer"
            disabled={offline}
            onClick={() => logEvent('Books', 'Report', book.title)}
          >
            <WarningIcon css={{ marginRight: spacing.xsmall }} />{' '}
            <Trans>Report a problem</Trans>
          </Button>
        </div>

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

export default withErrorPage(BookPage);
