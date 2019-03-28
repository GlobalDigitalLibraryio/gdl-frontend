// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { Query } from 'react-apollo';
import NextLink from 'next/link';
import getConfig from 'next/config';
import styled from '@emotion/styled';
import copyToClipboard from 'copy-to-clipboard';
import gql from 'graphql-tag';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
  Typography,
  Divider as MuiDivider
} from '@material-ui/core';
import NoSsr from '@material-ui/core/NoSsr';
import {
  Edit as EditIcon,
  Translate as TranslateIcon,
  Warning as WarningIcon,
  SaveAlt as SaveAltIcon,
  Share as ShareIcon,
  Link as LinkIcon
} from '@material-ui/icons';
import { FacebookIcon, TwitterIcon } from '../../components/icons';

import type { Context, ConfigShape } from '../../types';
import type { book_book as Book } from '../../gqlTypes';

import { QueryIsAdmin } from '../../gql';
import OnlineContext from '../../components/OnlineStatusContext';
import offlineLibrary from '../../lib/offlineLibrary';
import { logEvent } from '../../lib/analytics';
import { withErrorPage } from '../../hocs';
import { Link } from '../../routes';
import Layout from '../../components/Layout';
import Main from '../../components/Layout/Main';
import Head from '../../components/Head';
import { Container, IconButton, Hidden, View } from '../../elements';
import CoverImage from '../../components/CoverImage';
import BookList from '../../components/BookList';
import { spacing, misc } from '../../style/theme';
import mq from '../../style/mq';
import media from '../../style/media';
import { BookJsonLd, Metadata } from '../../components/BookDetailsPage';
import { DimensionContext } from '../../context/DimensionContext';
import Tutorial from '../../components/Tutorials/BookDetailsTutorial';

import Favorite, { FavoriteIcon } from '../../components/Favorite';
import Offline, { OfflineIcon } from '../../components/Offline';
import LevelRibbon from '../../components/Level/LevelRibbon';
import { TutorialContext } from '../../context/TutorialContext';
import {
  tabletBookTarget,
  tabletOfflineTarget,
  mobileBookTarget,
  mobileOfflineTarget
} from '../../components/Tutorials/BookDetailsTutorial';

const {
  publicRuntimeConfig: { zendeskUrl }
}: ConfigShape = getConfig();

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

const BOOK_QUERY = gql`
  query book($id: ID!) {
    book(id: $id) {
      id
      bookId
      title
      description
      category
      readingLevel
      bookFormat
      supportsTranslation
      additionalInformation
      downloads {
        epub
        pdf
      }
      license {
        url
        name
      }
      language {
        code
        name
      }
      coverImage {
        url
      }
      publisher {
        name
      }
      authors {
        name
      }
      illustrators {
        name
      }
      translators {
        name
      }
      photographers {
        name
      }
    }
  }
`;

class BookPage extends React.Component<{ book: Book }> {
  static async getInitialProps({ query, req, apolloClient }: Context) {
    const bookRes = await apolloClient.query({
      query: BOOK_QUERY,
      variables: { id: `${query.id}-${query.lang}` }
    });

    if (!bookRes.data.book) {
      return {
        statusCode: 404
      };
    }

    return {
      book: bookRes.data.book
    };
  }

  static contextType = OnlineContext;

  render() {
    const { book } = this.props;
    const offline: boolean = !this.context;

    return (
      <>
        <Head
          description={book.description}
          title={book.title}
          image={book.coverImage && book.coverImage.url}
        >
          <BookJsonLd book={book} />
        </Head>
        <Layout wrapWithMain={false}>
          <TutorialContext.Consumer>
            {({ bookDetailStatus, onFinishedBookDetailsTutorial }) => (
              <DimensionContext.Consumer>
                {({ media }) => (
                  <Tutorial
                    media={media}
                    status={!bookDetailStatus}
                    onFinish={onFinishedBookDetailsTutorial}
                  />
                )}
              </DimensionContext.Consumer>
            )}
          </TutorialContext.Consumer>
          <Main background="white" css={mq({ marginTop: [200, 100, 100] })}>
            <Container css={mq({ marginTop: [-160, -54, -54] })}>
              <div>
                <Grid>
                  <GridItem css={media.tablet`flex: 0 0 310px;`}>
                    <CoverImage
                      css={{ marginLeft: 'auto' }}
                      coverImage={book.coverImage}
                      size="large"
                    />
                    <Hidden only="tablet" css={{ marginTop: spacing.xxlarge }}>
                      <ReadBookLink
                        book={book}
                        target={tabletBookTarget}
                        cypressTarget="read-book-tablet-button"
                      />
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
                        <BookActions1
                          book={book}
                          key={book.id}
                          target={tabletOfflineTarget}
                        />
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
                      <FormattedMessage id="from" defaultMessage="from" />
                      {` ${book.publisher.name}`}
                    </Typography>

                    <Typography lang={book.language.code} paragraph>
                      {book.description}
                    </Typography>
                    <Hidden only="mobile">
                      <ReadBookLink
                        book={book}
                        target={mobileBookTarget}
                        cypressTarget="read-book-mobile-button"
                      />
                    </Hidden>
                  </GridItem>
                </Grid>
                <Hidden only="mobile" css={{ marginTop: spacing.large }}>
                  <BookActions1
                    book={book}
                    key={book.id}
                    isMobile
                    target={mobileOfflineTarget}
                  />
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
                    <BookActions2 book={book} />
                  </GridItem>
                </Grid>

                <Divider />
                <Query query={SIMILAR_BOOKS_QUERY} variables={{ id: book.id }}>
                  {({ data, loading, error }) => {
                    if (offline || error) {
                      return null;
                    }

                    return (
                      <View mb={spacing.medium}>
                        <BookList
                          loading={loading && !data.book}
                          heading={
                            <FormattedMessage
                              id="Similar"
                              defaultMessage="Similar"
                            />
                          }
                          books={data.book ? data.book.similar.results : []}
                        />
                      </View>
                    );
                  }}
                </Query>
              </div>
            </Container>
          </Main>
        </Layout>
      </>
    );
  }
}
const translations = defineMessages({
  download: {
    id: 'This book is only available for download',
    defaultMessage: 'This book is only available for download'
  }
});
const ReadBookLink = injectIntl(({ book, target, cypressTarget, intl }) =>
  book.bookFormat === 'HTML' ? (
    <Link
      route="read"
      passHref
      params={{ id: book.bookId, lang: book.language.code }}
      prefetch
    >
      <Button
        data-cy={cypressTarget}
        data-target={target}
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        onClick={() => logEvent('Books', 'Read', book.title)}
      >
        <FormattedMessage id="Read book" defaultMessage="Read book" />
      </Button>
    </Link>
  ) : (
    <>
      <Button size="large" variant="raised" disabled fullWidth>
        <FormattedMessage id="Read book" defaultMessage="Read book" />
      </Button>
      <Typography
        align="center"
        css={{ marginTop: spacing.small }}
        variant="caption"
      >
        {intl.formatMessage(translations.download)}
      </Typography>
    </>
  )
);

/**
 * Favorite, share, offline
 * Remember to render this with a key prop, easier to just blow away the entire component than handling
 * updated props
 */
class BookActions1 extends React.Component<
  {
    book: Book,
    target: string,
    isMobile?: boolean
  },
  {
    anchorEl: ?HTMLElement
  }
> {
  state = {
    anchorEl: null
  };

  static contextType = OnlineContext;

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

  render() {
    const { book, target, isMobile } = this.props;
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
          <Favorite book={book}>
            {({ onClick, isFav }) => (
              <IconButton
                // Moving the fav button up top on mobile
                css={media.mobile`position: absolute; top: 0; left: ${
                  misc.gutter
                }px;`}
                onClick={onClick}
                icon={
                  <FavoriteIcon
                    data-cy={
                      isMobile ? 'save-favorite-mobile' : 'save-favorite-tablet'
                    }
                    filled={isFav}
                  />
                }
                label={
                  <FormattedMessage id="Favorite" defaultMessage="Favorite" />
                }
              />
            )}
          </Favorite>

          {offlineLibrary && book.bookFormat !== 'PDF' && (
            <NoSsr>
              <Offline book={book}>
                {({ onClick, downloading, offlined }) => (
                  <IconButton
                    className={target}
                    isLoading={downloading}
                    icon={
                      <OfflineIcon
                        data-cy={
                          isMobile ? 'save-book-mobile' : 'save-book-tablet'
                        }
                        filled={offlined}
                      />
                    }
                    onClick={onClick}
                    label={
                      <FormattedMessage
                        id="Save offline"
                        defaultMessage="Save offline"
                      />
                    }
                  />
                )}
              </Offline>
            </NoSsr>
          )}

          {!offline && (
            <IconButton
              icon={<ShareIcon />}
              label={<FormattedMessage id="Share" defaultMessage="Share" />}
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
              <FormattedMessage id="Copy URL" defaultMessage="Copy URL" />
            </ListItemText>
          </MenuItem>
        </Menu>
      </>
    );
  }
}

/**
 * Download, translate, report book
 */
class BookActions2 extends React.Component<
  { book: Book },
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
    const { book } = this.props;
    const offline: boolean = !this.context;
    return (
      <>
        <div>
          <Button
            aria-owns={this.state.anchorEl ? 'download-book-menu' : null}
            color="primary"
            aria-haspopup="true"
            data-cy="download-book-button"
            onClick={this.handleDownloadClick}
            disabled={offline}
          >
            <SaveAltIcon css={{ marginRight: spacing.xsmall }} />
            <FormattedMessage id="Download" defaultMessage="Download" />
          </Button>
        </div>

        {book.supportsTranslation && (
          <div>
            <Link
              route="translate"
              passHref
              params={{ id: book.bookId, lang: book.language.code }}
            >
              <Button
                data-cy="translate-book-button"
                onClick={() => logEvent('Books', 'Translate', book.title)}
                color="primary"
                disabled={offline}
              >
                <TranslateIcon css={{ marginRight: spacing.xsmall }} />{' '}
                <FormattedMessage
                  id="Translate this book"
                  defaultMessage="Translate this book"
                />
              </Button>
            </Link>
          </div>
        )}
        <QueryIsAdmin>
          {({ isAdmin }) =>
            isAdmin && (
              <div>
                <NextLink
                  href={{
                    pathname: '/admin/edit/book',
                    query: { id: book.bookId, lang: book.language.code }
                  }}
                  passHref
                >
                  <Button color="primary" disabled={offline}>
                    <EditIcon css={{ marginRight: spacing.xsmall }} />
                    Edit
                  </Button>
                </NextLink>
              </div>
            )
          }
        </QueryIsAdmin>
        <div>
          <Button
            data-cy="report-book-button"
            color="primary"
            href={zendeskUrl}
            target="_blank"
            rel="noopener noreferrer"
            disabled={offline}
            onClick={() => logEvent('Books', 'Report', book.title)}
          >
            <WarningIcon css={{ marginRight: spacing.xsmall }} />{' '}
            <FormattedMessage
              id="Report a problem"
              defaultMessage="Report a problem"
            />
          </Button>
        </div>

        <Menu
          id="download-book-menu"
          onClose={this.closeDownloadMenu}
          anchorEl={this.state.anchorEl}
          open={Boolean(this.state.anchorEl)}
          data-cy="download-book-menu"
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
              <FormattedMessage
                id="E-book (EPUB)"
                defaultMessage="E-book (EPUB)"
              />
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
              <FormattedMessage
                id="Printable book (PDF)"
                defaultMessage="Printable book (PDF)"
              />
            </MenuItem>
          )}
        </Menu>
      </>
    );
  }
}

const SIMILAR_BOOKS_QUERY = gql`
  query similar($id: ID!) {
    book(id: $id) {
      id
      similar {
        results {
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
    }
  }
`;

export default withErrorPage(BookPage);
