// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from '@lingui/react';
import { MdTranslate } from 'react-icons/lib/md';

import styled from 'react-emotion';
import config from '../../config';
import { fetchBook, fetchSimilarBooks } from '../../fetch';
import type { Book, BookDetails, RemoteData, Context } from '../../types';
import defaultPage from '../../hocs/defaultPage';
import { Link } from '../../routes';
import Box from '../../components/Box';
import Flex from '../../components/Flex';
import Layout from '../../components/Layout';
import A from '../../components/A';
import H1 from '../../components/H1';
import P from '../../components/P';
import Card from '../../components/Card';
import BookCover from '../../components/BookCover';
import Button from '../../components/Button';
import Container from '../../components/Container';
import Head from '../../components/Head';
import BookList from '../../components/BookList';
import media from '../../style/media';
import theme from '../../style/theme';
import { flexColumnCentered } from '../../style/flex';
import BookMeta from '../../components/BookMeta';

type Props = {
  book: RemoteData<BookDetails>,
  similar: RemoteData<{
    results: Array<Book>
  }>,
  url: {
    query: {
      level?: string
    },
    asPath: string
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
  background-color: ${theme.colors.grayLight};
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

class BookPage extends React.Component<Props> {
  static async getInitialProps({ query, accessToken }: Context) {
    const [book, similar] = await Promise.all([
      fetchBook(query.id, query.lang)(accessToken),
      fetchSimilarBooks(query.id, query.lang)(accessToken)
    ]);

    return {
      book,
      similar
    };
  }

  getCrumbs() {
    const { book, url } = this.props;
    const { level } = url.query;

    const crumbs = [this.props.book.title];

    if (level != null) {
      crumbs.unshift(
        <Link route="level" params={{ lang: book.language.code, level }}>
          <a>
            <Trans>Level {level}</Trans>
          </a>
        </Link>
      );
    } else if (url.asPath.includes('/new/')) {
      crumbs.unshift(
        <Link route="new" params={{ lang: book.language.code }}>
          <a>
            <Trans>New arrivals</Trans>
          </a>
        </Link>
      );
    }
    return crumbs;
  }

  render() {
    const { similar, book } = this.props;

    return (
      <Layout crumbs={this.getCrumbs()} language={book.language}>
        <Head
          title={book.title}
          description={book.description}
          imageUrl={book.coverPhoto ? book.coverPhoto.large : null}
          isBookType
        />
        <Container pt={[15, 20]}>
          <Flex mt={[120, 0]} style={{ position: 'relative' }}>
            <CoverWrap>
              <BookCover
                coverPhoto={book.coverPhoto}
                w={[130, 260]}
                h={[175, 365]}
              />
            </CoverWrap>
            <HeroCard textAlign="center" p={[15, 20]} pt={[80, 20]} flex="1">
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
              <Link
                route="read"
                passHref
                params={{ id: book.id, lang: book.language.code }}
                prefetch
              >
                <Button color="green">
                  <Trans>Read Book</Trans>
                </Button>
              </Link>
              <Box mt={[15, 20]}>
                <A isBold isUnderlined download href={book.downloads.epub}>
                  <Trans>Download book</Trans>
                </A>
              </Box>
            </HeroCard>
          </Flex>
        </Container>
        <Container pb={[15, 20]}>
          <Box ml={[0, 'auto']} w={['auto', 438]}>
            <BookMeta book={book} />
            {config.TRANSLATION_PAGES &&
              book.supportsTranslation && (
                <React.Fragment>
                  <Hr />
                  <Box my={[15, 20]} textAlign="center">
                    <Link
                      route="translate"
                      passHref
                      params={{ id: book.id, lang: book.language.code }}
                    >
                      <Button>
                        <MdTranslate /> <Trans>Translate book</Trans>
                      </Button>
                    </Link>
                  </Box>
                </React.Fragment>
              )}
          </Box>
          {similar &&
            similar.results.length > 0 && (
              <React.Fragment>
                <Hr />
                <BookList
                  books={similar.results}
                  mt={20}
                  heading={<Trans>Similar</Trans>}
                />
              </React.Fragment>
            )}
        </Container>
      </Layout>
    );
  }
}

export default defaultPage(BookPage);
