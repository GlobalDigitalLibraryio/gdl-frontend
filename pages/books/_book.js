// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { DateFormat, Trans } from '@lingui/react';
import styled from 'react-emotion';
import config from '../../config';
import { fetchBook, fetchSimilarBooks } from '../../fetch';
import type { Book, RemoteData, Context } from '../../types';
import defaultPage from '../../hocs/defaultPage';
import { Link } from '../../routes';
import Box from '../../components/Box';
import Flex from '../../components/Flex';
import Layout from '../../components/Layout';
import Ribbon from '../../components/Ribbon';
import A from '../../components/A';
import H3 from '../../components/H3';
import H1 from '../../components/H1';
import H6 from '../../components/H6';
import P from '../../components/P';
import Card from '../../components/Card';
import BookCover from '../../components/BookCover';
import { ButtonLink } from '../../components/Button';
import Container from '../../components/Container';
import Head from '../../components/Head';
import BookList from '../../components/BookList';
import media from '../../style/media';
import { flexColumnCentered } from '../../style/flex';

const iconsPNG = require('../../static/about/icons.png');

type Props = {
  book: RemoteData<Book>,
  similar: RemoteData<{
    results: Array<Book>
  }>
};

const CoverWrap = styled('div')`
  ${media.mobile`
    position: absolute;
    top: -120px;
    z-index: 10;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
  `} height: 190px;

  ${media.tablet`
    height: 365px;
    flex: 0 0 260px;
    margin-right: 20px;
  `};
`;

const HeroCard = styled(Card)`
  ${flexColumnCentered};
`;

const Hero = styled('div')`
  background-image: url('${iconsPNG}');
  background-size: contain;
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

  render() {
    const { similar, book } = this.props;

    const contributors = book.contributors
      .map(contributor => <span key={contributor.id}>{contributor.name}</span>)
      .map((item, index) => [index > 0 && ', ', item]);

    const categories = book.categories
      .map(category => <span key={category.id}>{category.name}</span>)
      .map((item, index) => [index > 0 && ', ', item]);

    return (
      <Layout
        crumbs={[
          <Link route="books" params={{ lang: book.language.code }}>
            <a>{book.language.name}</a>
          </Link>,
          book.title
        ]}
        language={book.language}
      >
        <Head
          title={book.title}
          description={book.description}
          imageUrl={book.coverPhoto ? book.coverPhoto.large : null}
          isBookType
        />
        <Hero>
          <Container py={[15, 20]}>
            <Flex mt={[120, 0]} style={{ position: 'relative' }}>
              <CoverWrap>
                <BookCover book={book} />
              </CoverWrap>
              <HeroCard textAlign="center" p={[15, 20]} pt={[80, 20]} flex="1">
                <H1 fontSize={[28, 38]}>{book.title}</H1>
                <P fontSize={14}>
                  <Trans>
                    from <span>{book.publisher.name}</span>
                  </Trans>
                </P>
                <P fontSize={[14, 16]} lineHeight={[22, 26]}>
                  {book.description}
                </P>
                <Link
                  route="read"
                  passHref
                  params={{ id: book.id, lang: book.language.code }}
                  prefetch
                >
                  <ButtonLink>
                    <Trans>Read Book</Trans>
                  </ButtonLink>
                </Link>
                <Box mt={[15, 20]}>
                  <A href={book.downloads.epub}>
                    <Trans>Download book</Trans>
                  </A>
                </Box>
                {config.TRANSLATION_PAGES && (
                  <Box mt={[15, 20]}>
                    <Link
                      route="translate"
                      passHref
                      params={{ id: book.id, lang: book.language.code }}
                    >
                      <A>
                        <Trans>Translate book</Trans>
                      </A>
                    </Link>
                  </Box>
                )}
              </HeroCard>
            </Flex>
          </Container>
        </Hero>
        <Container pb={[15, 20]}>
          <Card p={[15, 20]}>
            <Flex display={['block', 'flex']}>
              <Ribbon level={book.readingLevel} />
              <Box flex="1 1 50%" mr={[0, '5%']}>
                {book.datePublished && (
                  <Box mb={10}>
                    <H6>
                      <Trans>Published</Trans>
                    </H6>
                    <DateFormat value={new Date(book.datePublished)} />
                  </Box>
                )}
                <Box mb={10}>
                  <H6>
                    <Trans>Authors</Trans>
                  </H6>
                  {contributors}
                </Box>
              </Box>
              <Box flex="1 1 50%">
                <H6>
                  <Trans>License</Trans>
                </H6>
                <a href={book.license.url}>{book.license.description}</a>
              </Box>
              {book.categories.length > 0 && (
                <Box mb={10}>
                  <H6>
                    <Trans>categories</Trans>
                  </H6>,
                  {categories},
                </Box>
              )}
            </Flex>
          </Card>
          <H3>
            <Trans>Similar</Trans>
          </H3>
          <BookList books={similar.results} mt={20} />
        </Container>
      </Layout>
    );
  }
}

export default defaultPage(BookPage);
