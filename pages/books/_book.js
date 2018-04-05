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
  MdWarning
} from 'react-icons/lib/md';
import styled from 'react-emotion';

import config from '../../config';
import { fetchBook, fetchSimilarBooks } from '../../fetch';
import type { Book, BookDetails, Context } from '../../types';
import defaultPage from '../../hocs/defaultPage';
import errorPage from '../../hocs/errorPage';
import { Link } from '../../routes';
import BrowseLink from '../../components/BrowseLink';
import Box from '../../components/Box';
import Flex from '../../components/Flex';
import Layout from '../../components/Layout';
import Head from '../../components/Head';
import A from '../../components/A';
import H1 from '../../components/H1';
import P from '../../components/P';
import Card from '../../components/Card';
import BookCover from '../../components/BookCover';
import Button from '../../components/Button';
import Container from '../../components/Container';
import BookList from '../../components/BookList';
import media from '../../style/media';
import { colors } from '../../style/theme';
import { flexColumnCentered } from '../../style/flex';
import BookMeta from '../../components/BookMeta';
import { DownloadBookMenu, BookJsonLd } from '../../components/BookDetailsPage';
import ReadingLevelTrans from '../../components/ReadingLevelTrans';
import { LanguageCategory } from '../../components/LanguageCategoryContext';

type Props = {
  book: BookDetails,
  similarBooks: Array<Book>,
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

const Hr = styled('hr')`
  height: 1px;
  background-color: ${colors.base.grayLight};
  border-style: none;
  margin: 0;
  ${media.mobile`
    margin-left: -15px;
    margin-right: -15px;
  `};
`;

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
            <Container pt={[15, 20]}>
              <Flex mt={[120, 0]} style={{ position: 'relative' }}>
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
                  pt={[80, 20]}
                  flex="1"
                >
                  <H1 fontSize={[28, 38]} lang={book.language.code}>
                    {book.title}
                  </H1>
                  <P fontSize={14}>
                    <Trans>
                      from <span>{book.publisher.name}</span>
                    </Trans>
                  </P>
                  <P
                    fontSize={[14, 16]}
                    lineHeight={[22, 26]}
                    lang={book.language.code}
                  >
                    {book.description}
                  </P>
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
                      <Box mt={[15, 20]}>
                        <A
                          aria-expanded={this.state.showDownloadMenu}
                          isBold
                          onClick={this.handleToggleShowDownloadMenu}
                          style={{ color: '#444' }}
                        >
                          <Trans>Download book</Trans>
                          {this.state.showDownloadMenu ? (
                            <MdKeyboardArrowUp aria-hidden />
                          ) : (
                            <MdKeyboardArrowDown aria-hidden />
                          )}
                        </A>
                      </Box>
                    </Fragment>
                  )}
                  {book.bookFormat === 'PDF' && (
                    <Button href={book.downloads.pdf}>
                      <Trans>Download book</Trans>
                    </Button>
                  )}
                </HeroCard>
              </Flex>
            </Container>
            <Container pb={[15, 20]}>
              <Box ml={[0, 'auto']} w={['auto', 438]}>
                <BookMeta book={book} />
                {config.TRANSLATION_PAGES &&
                  book.supportsTranslation && (
                    <Fragment>
                      <Hr />
                      <Box my={[15, 20]} textAlign="center">
                        <Link
                          route="translate"
                          passHref
                          params={{ id: book.id, lang: book.language.code }}
                        >
                          <A isBold>
                            <MdTranslate aria-hidden />{' '}
                            <Trans>Translate this book</Trans>
                          </A>
                        </Link>
                      </Box>
                    </Fragment>
                  )}
                <Hr />
                <Box my={[15, 20]} textAlign="center">
                  <A
                    isBold
                    href={config.zendeskUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MdWarning aria-hidden />{' '}
                    <Trans>Report a problem with this book</Trans>
                  </A>
                </Box>
              </Box>
              {similarBooks.length > 0 && (
                <Fragment>
                  <Hr />
                  <BookList
                    books={similarBooks}
                    mt={20}
                    heading={<Trans>Similar</Trans>}
                  />
                </Fragment>
              )}
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
