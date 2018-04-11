// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React, { Fragment } from 'react';
import { Trans } from '@lingui/react';
import {
  MdTranslate,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdWarning,
  MdEdit
} from 'react-icons/lib/md';
import styled from 'react-emotion';

import config from '../../config';
import { fetchBook, fetchSimilarBooks } from '../../fetch';
import type { Book, BookDetails, Context } from '../../types';
import defaultPage from '../../hocs/defaultPage';
import errorPage from '../../hocs/errorPage';
import { Link } from '../../routes';
import BrowseLink from '../../components/BrowseLink';
import Layout from '../../components/Layout';
import Head from '../../components/Head';
import A from '../../elements/A';
import Text from '../../elements/Text';
import View from '../../elements/View';
import Container from '../../elements/Container';
import Card from '../../components/Card';
import BookCover from '../../components/BookCover';
import Button from '../../components/Button';
import BookList from '../../components/BookList';
import { hasClaim, claims } from '../../lib/auth/token';
import media from '../../style/media';
import { colors, fonts, spacing } from '../../style/theme';
import { flexColumnCentered } from '../../style/flex';
import {
  DownloadBookMenu,
  BookJsonLd,
  Metadata
} from '../../components/BookDetailsPage';
import ReadingLevelTrans from '../../components/ReadingLevelTrans';
import { LanguageCategory } from '../../components/LanguageCategoryContext';

type Props = {
  book: BookDetails,
  similarBooks: Array<Book>,
  userHasEditAccess: boolean,
  url: {
    query: {
      id: string
    }
  }
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

const HeroCard = styled(Card)`
  ${flexColumnCentered};
`;

class BookPage extends React.Component<Props, { showDownloadMenu: boolean }> {
  state = {
    showDownloadMenu: false
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

  handleToggleShowDownloadMenu = () =>
    this.setState(state => ({ showDownloadMenu: !state.showDownloadMenu }));

  render() {
    const { similarBooks, book } = this.props;

    return (
      <Fragment>
        <Head
          title={book.title}
          description={book.description}
          image={book.coverPhoto ? book.coverPhoto.large : null}
        >
          <BookJsonLd book={book} />
        </Head>
        <LanguageCategory
          category={book.category}
          languageCode={book.language.code}
        >
          <Layout crumbs={this.getCrumbs()}>
            <Container>
              <View flexDirection="row" mt={['135px', spacing.medium]}>
                <CoverWrap>
                  <BookCover
                    coverPhoto={book.coverPhoto}
                    w={[130, 260]}
                    h={[175, 365]}
                  />
                </CoverWrap>
                <HeroCard
                  textAlign="center"
                  p={[15, 20]}
                  pt={[70, 20]}
                  flex="1"
                >
                  <Text
                    lang={book.language.code}
                    fontSize={['1.7rem', '2.1rem']}
                    accessibilityRole="heading"
                    fontWeight={fonts.weight.medium}
                  >
                    {book.title}
                  </Text>

                  <Text textAlign="center">
                    <Trans>from {book.publisher.name}</Trans>
                  </Text>

                  <Text
                    lang={book.language.code}
                    textAlign="center"
                    my={spacing.medium}
                  >
                    {book.description}
                  </Text>

                  {book.bookFormat === 'HTML' && (
                    <Fragment>
                      <Link
                        route="read"
                        passHref
                        params={{ id: book.id, lang: book.language.code }}
                        prefetch
                      >
                        <Button>
                          <Trans>Read Book</Trans>
                        </Button>
                      </Link>
                      <Text
                        aria-expanded={this.state.showDownloadMenu}
                        fontWeight={fonts.weight.medium}
                        mt={spacing.medium}
                        onClick={this.handleToggleShowDownloadMenu}
                      >
                        <Trans>Download book</Trans>
                        {this.state.showDownloadMenu ? (
                          <MdKeyboardArrowUp aria-hidden />
                        ) : (
                          <MdKeyboardArrowDown aria-hidden />
                        )}
                      </Text>

                      {this.props.userHasEditAccess && (
                        <Link
                          route="edit"
                          params={{ lang: book.language.code, id: book.id }}
                          passHref
                        >
                          <EditBookLink title="Edit book">
                            <MdEdit />
                          </EditBookLink>
                        </Link>
                      )}
                    </Fragment>
                  )}
                  {book.bookFormat === 'PDF' && (
                    <Button href={book.downloads.pdf}>
                      <Trans>Download book</Trans>
                    </Button>
                  )}
                </HeroCard>
              </View>
            </Container>

            <Container
              style={{
                marginTop: spacing.medium
              }}
            >
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
                        <A
                          my={spacing.medium}
                          textAlign="center"
                          fontWeight={fonts.weight.medium}
                        >
                          <MdTranslate aria-hidden />{' '}
                          <Trans>Translate this book</Trans>
                        </A>
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
                  <A
                    my={spacing.medium}
                    textAlign="center"
                    fontWeight={fonts.weight.medium}
                    href={config.zendeskUrl}
                    openNewTab
                  >
                    <MdWarning aria-hidden />{' '}
                    <Trans>Report a problem with this book</Trans>
                  </A>
                </View>
              </View>
            </Container>

            <Container>
              <View
                borderTop={BORDER_STYLE}
                mb={spacing.medium}
                pt={spacing.medium}
              >
                {similarBooks.length > 0 && (
                  <BookList
                    heading={<Trans>Similar</Trans>}
                    books={similarBooks}
                  />
                )}
              </View>
            </Container>

            {this.state.showDownloadMenu && (
              <DownloadBookMenu
                book={book}
                onClose={this.handleToggleShowDownloadMenu}
              />
            )}
          </Layout>
        </LanguageCategory>
      </Fragment>
    );
  }
}

export default defaultPage(errorPage(BookPage));
