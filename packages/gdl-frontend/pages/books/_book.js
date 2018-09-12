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
  Card,
  CardContent,
  Typography,
  Divider,
  Tab
} from '@material-ui/core';
import {
  Edit as EditIcon,
  CloudDownload as CloudDownloadIcon,
  Translate as TranslateIcon,
  Warning as WarningIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteOutlineIcon,
  Share as ShareIcon
} from '@material-ui/icons';

import { fetchBook, fetchSimilarBooks } from '../../fetch';
import { logEvent } from '../../lib/analytics';
import type { Book, BookDetails, Context, ConfigShape } from '../../types';
import { errorPage } from '../../hocs';
import { Link } from '../../routes';
import Layout from '../../components/Layout';
import Head from '../../components/Head';
import { Center, View } from '../../elements';
import Container from '../../elements/Container';
import CoverImage from '../../components/CoverImage';
import BookList from '../../components/BookList';
import { hasClaim, claims } from 'gdl-auth';
import media from '../../style/media';
import { colors, spacing } from '../../style/theme';
import { BookJsonLd, Metadata } from '../../components/BookDetailsPage';
import Favorite from '../../components/Favorite';

const {
  publicRuntimeConfig: { zendeskUrl }
}: ConfigShape = getConfig();

type Props = {
  book: BookDetails,
  similarBooks: Array<Book>,
  userHasEditAccess: boolean
};

const CoverWrap = styled('div')`
  ${media.mobile`
    position: absolute;
    top: -120px;
    z-index: 10;
    left: 50%;
    transform: translateX(-50%);
  `} ${media.tablet`
    flex: 0 0 260px;
    margin-right: 20px;
  `};
`;

const EditBookLink = styled('a')`
  color: ${colors.base.white};
  position: absolute;
  top: 0;
  right: 0;
  padding: 5px;
  transition: all 0.3s ease;
  background: rgba(0, 0, 0, 0.5);
  &:hover {
    background: rgba(0, 0, 0, 0.6);
  }
`;

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

  componentDidMount() {
    this.setState({ supportsNavigatorShare: Boolean(navigator.share) });
  }

  handleDownloadClick = event =>
    this.setState({ anchorEl: event.currentTarget });

  closeDownloadMenu = () => this.setState({ anchorEl: null });

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
        <Layout>
          <Container>
            <View flexDirection="row" mt={['135px', spacing.medium]}>
              <CoverWrap>
                <CoverImage
                  src={book.coverImage && book.coverImage.url}
                  size="large"
                />
              </CoverWrap>

              {/* All this flexing on => tablet is because we want to push the buttons down in the card*/}
              <Card
                css={[
                  { width: '100%' },
                  media.tablet({ display: 'flex', flexDirection: 'column' })
                ]}
              >
                <CardContent
                  css={[
                    media.mobile({ paddingTop: '70px' }),
                    media.tablet({
                      display: 'flex',
                      flexDirection: 'column',
                      flex: '1'
                    })
                  ]}
                >
                  <Typography
                    lang={book.language.code}
                    variant="headline"
                    css={media.mobile`text-align: center`}
                  >
                    {book.title}
                  </Typography>

                  <Typography
                    paragraph
                    variant="subheading"
                    css={media.mobile`text-align: center`}
                  >
                    <Trans>from {book.publisher.name}</Trans>
                  </Typography>

                  <Typography
                    lang={book.language.code}
                    paragraph
                    css={[
                      media.mobile`text-align: center`,
                      media.tablet({ flex: 1 })
                    ]}
                  >
                    {book.description}
                  </Typography>

                  <Center>
                    {book.bookFormat === 'HTML' ? (
                      <Link
                        route="read"
                        passHref
                        params={{ id: book.id, lang: book.language.code }}
                        prefetch
                      >
                        <Button
                          variant="raised"
                          color="primary"
                          size="large"
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
                  </Center>

                  {this.props.userHasEditAccess && (
                    <NextLink
                      href={{
                        pathname: '/admin/edit',
                        query: { id: book.id, lang: book.language.code }
                      }}
                      passHref
                    >
                      <EditBookLink title="Edit book">
                        <EditIcon />
                      </EditBookLink>
                    </NextLink>
                  )}
                </CardContent>
                <div css={{ display: 'flex' }}>
                  <Favorite
                    id={this.props.book.id}
                    language={this.props.book.language.code}
                  >
                    {({ onClick, isFav }) => (
                      <TabButton
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
                            <FavoriteIcon
                              style={isFav ? { color: 'red' } : null}
                            />
                          ) : (
                            <FavoriteOutlineIcon />
                          )
                        }
                        label={<Trans>Favorite</Trans>}
                      />
                    )}
                  </Favorite>

                  <TabButton
                    icon={<CloudDownloadIcon />}
                    label={<Trans>Download</Trans>}
                    aria-owns={
                      this.state.anchorEl ? 'download-book-menu' : null
                    }
                    aria-haspopup="true"
                    onClick={this.handleDownloadClick}
                  />

                  {this.state.supportsNavigatorShare && (
                    <TabButton
                      icon={<ShareIcon />}
                      label={<Trans>Share</Trans>}
                      onClick={this.handleShareClick}
                    />
                  )}
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
                      <Trans>E-book (ePub)</Trans>
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
              </Card>
            </View>
          </Container>

          <Container mt={spacing.medium}>
            <View ml={['0', 'auto']} width={['auto', '438px']}>
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
                mt={book.supportsTranslation ? '0' : spacing.medium}
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

const TabButton = props => (
  <Tab
    role="button"
    css={`
      flex-grow: 1;
      flex-shrink: 1;
      ${media.tablet`
        min-width: 72px;
      `};
    `}
    {...props}
  />
);

export default errorPage(BookPage);
