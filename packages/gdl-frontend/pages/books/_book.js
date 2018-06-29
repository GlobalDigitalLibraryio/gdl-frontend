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
import styled from 'react-emotion';
import {
  Menu,
  MenuItem,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  Grid
} from '@material-ui/core';
import {
  Edit as EditIcon,
  FileDownload as FileDownloadIcon,
  Translate as TranslateIcon,
  Warning as WarningIcon
} from '@material-ui/icons';

import config from '../../config';
import { fetchBook, fetchSimilarBooks } from '../../fetch';
import type { Book, BookDetails, Context } from '../../types';
import { errorPage, withMuiRoot } from '../../hocs';
import { Link } from '../../routes';
import BrowseLink from '../../components/BrowseLink';
import Layout from '../../components/Layout';
import Head from '../../components/Head';
import View from '../../elements/View';
import Container from '../../elements/Container';
import BookCover from '../../components/BookCover';
import BookList from '../../components/BookList';
import { hasClaim, claims } from '../../lib/auth/token';
import media from '../../style/media';
import { colors, spacing } from '../../style/theme';
import { BookJsonLd, Metadata } from '../../components/BookDetailsPage';
import ReadingLevelTrans from '../../components/ReadingLevelTrans';

type Props = {
  book: BookDetails,
  similarBooks: Array<Book>,
  userHasEditAccess: boolean,
  userHasEditImageAccess: boolean
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

class BookPage extends React.Component<Props, { anchorEl: ?HTMLElement }> {
  state = {
    anchorEl: null
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
      userHasEditImageAccess: hasClaim(claims.writeImage, req),
      // Don't let similar books crash the page
      similarBooks: similarRes.isOk ? similarRes.data.results : []
    };
  }

  getCrumbs() {
    const { book } = this.props;

    return [
      <BrowseLink
        lang={book.language.code}
        readingLevel={book.readingLevel}
        category={book.category}
      >
        <a>
          <ReadingLevelTrans readingLevel={book.readingLevel} />
        </a>
      </BrowseLink>,
      book.title
    ];
  }

  handleDownloadClick = event =>
    this.setState({ anchorEl: event.currentTarget });

  closeDownloadMenu = () => this.setState({ anchorEl: null });

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
        <Layout crumbs={this.getCrumbs()} category={book.category}>
          <Container>
            <View flexDirection="row" mt={['135px', spacing.medium]}>
              <CoverWrap>
                <View>
                  <Link
                    route="read"
                    passHref
                    params={{ id: book.id, lang: book.language.code }}
                    prefetch
                  >
                    <a title={book.title} aria-hidden>
                      <BookCover
                        coverImage={book.coverImage}
                        w={[130, 260]}
                        h={[175, 365]}
                      />
                    </a>
                  </Link>
                  {this.props.userHasEditImageAccess && (
                    <NextLink
                      href={{
                        pathname: '/admin/crop',
                        query: {
                          imageUrl: book.coverImage && book.coverImage.url
                        }
                      }}
                      passHref
                    >
                      <EditBookLink title="Edit book image">
                        <EditIcon />
                      </EditBookLink>
                    </NextLink>
                  )}
                </View>
              </CoverWrap>

              {/* All this flexing on => tablet is because we want to push the buttons down in the card*/}
              <Card
                css={[{ width: '100%' }, media.tablet({ display: 'flex' })]}
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

                  <Grid
                    container
                    direction="column"
                    alignItems="center"
                    spacing={16}
                  >
                    {book.bookFormat === 'HTML' && (
                      <Fragment>
                        <Grid item>
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
                            >
                              <Trans>Read book</Trans>
                            </Button>
                          </Link>
                        </Grid>
                        <Grid item>
                          <Button
                            aria-owns={
                              this.state.anchorEl ? 'download-book-menu' : null
                            }
                            aria-haspopup="true"
                            color="primary"
                            onClick={this.handleDownloadClick}
                          >
                            <FileDownloadIcon /> <Trans>Download book</Trans>
                          </Button>
                        </Grid>
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
                              onClick={this.closeDownloadMenu}
                            >
                              <Trans>E-book (ePUB)</Trans>
                            </MenuItem>
                          )}
                          {book.downloads.pdf && (
                            <MenuItem
                              href={book.downloads.pdf}
                              component="a"
                              onClick={this.closeDownloadMenu}
                            >
                              <Trans>Printable book (PDF)</Trans>
                            </MenuItem>
                          )}
                        </Menu>

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
                      </Fragment>
                    )}
                    {book.bookFormat === 'PDF' && (
                      <Grid item>
                        <Button
                          href={book.downloads.pdf}
                          color="primary"
                          variant="raised"
                          size="large"
                        >
                          <Trans>Download book</Trans>
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </View>
          </Container>

          <Container mt={spacing.medium}>
            <View ml={[0, 'auto']} w={['auto', 438]}>
              <Metadata book={book} />
              {config.TRANSLATION_PAGES &&
                book.supportsTranslation && (
                  <View borderTop={BORDER_STYLE} mt={spacing.medium}>
                    <Link
                      route="translate"
                      passHref
                      params={{ id: book.id, lang: book.language.code }}
                    >
                      <Button
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
                mt={
                  config.TRANSLATION_PAGES && book.supportsTranslation
                    ? 0
                    : spacing.medium
                }
              >
                <Button
                  color="primary"
                  css={{ margin: `${spacing.medium} 0` }}
                  href={config.zendeskUrl}
                  target="_blank"
                  rel="noopener noreferrer"
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

export default withMuiRoot(errorPage(BookPage));
