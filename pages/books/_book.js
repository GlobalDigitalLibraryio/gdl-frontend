// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import { DateFormat } from 'lingui-react';
import fetch from 'isomorphic-unfetch';
import { MdLanguage, MdTranslate, MdFileDownload } from 'react-icons/lib/md';
import styled from 'styled-components';
import { responsiveStyle } from 'styled-system';
import type { Book } from '../../types';
import withI18n from '../../hocs/withI18n';
import Title from '../../components/Title';
import Box from '../../components/Box';
import Flex from '../../components/Flex';
import Navbar, { NavItem, HamburgerButton } from '../../components/Navbar';
import CardBase, { CardAction } from '../../components/Card';
import BookCover from '../../components/BookCover';
import Button from '../../components/Button';
import Heading from '../../components/Heading';
import Container from '../../components/Container';
import ReadingLevel from '../../components/ReadingLevel';
import Hero from '../../components/Hero';
import Meta from '../../components/Meta';
import HorizontalBookList from '../../components/HorizontalBookList';
import SimilarLink from '../../components/SimilarLink';

// Number of similar books to fetch
const SIMILAR_BOOKS_PAGE_SIZE = 3;

type Props = {
  book: Book,
  similar: Array<Book>,
};

const BookMetaData = ({
  heading,
  children,
}: {
  heading: string,
  children: React.Node,
}) => (
  <Box mb={2}>
    <Heading>{heading}</Heading>
    {children}
  </Box>
);

const BookDescription = styled.div`text-align: center;`;

// Extend the regular Card, allowing us to alter the border radius responsively
const Card = CardBase.extend`
  ${responsiveStyle('border-radius', 'borderRadius')};
`;

class BookPage extends React.Component<Props> {
  static async getInitialProps({ query }) {
    const [bookRes, similarRes] = await Promise.all([
      fetch(
        `http://test-proxy-1865761686.eu-central-1.elb.amazonaws.com/book-api/v1/books/eng/${query.id}`,
      ),
      fetch(
        `http://test-proxy-1865761686.eu-central-1.elb.amazonaws.com/book-api/v1/books/eng/similar/${query.id}?page-size=${SIMILAR_BOOKS_PAGE_SIZE}`,
      ),
    ]);

    const [book, similar] = await Promise.all([
      bookRes.json(),
      similarRes.json(),
    ]);

    return {
      book,
      similar: similar.results,
    };
  }

  render() {
    const { book } = this.props;

    const contributors = book.contributors
      .map(contributor => (
        <a href="" key={contributor.id}>
          {contributor.name}
        </a>
      ))
      .map((item, index) => [index > 0 && ', ', item]);

    const categories = book.categories
      .map(category => (
        <a href="" key={category.id}>
          {category.name}
        </a>
      ))
      .map((item, index) => [index > 0 && ', ', item]);

    return (
      <div>
        <Meta
          title={book.title}
          description={book.description}
          image={book.coverPhoto.large}
        />
        <Navbar>
          <NavItem>Test</NavItem>
          <NavItem>Søkefelt</NavItem>
          <HamburgerButton />
        </Navbar>

        <Container>
          <Title fontSize={[28, 38]} textAlign="center">
            {book.title}
          </Title>
          <Flex>
            <Flex w={1 / 2} justify="flex-end" mr={1}>
              <BookCover book={book} />
            </Flex>
            <Box w={1 / 2} fontSize="14px" ml={1}>
              <BookMetaData heading="Publisher">
                <a href="">{book.publisher.name}</a>
              </BookMetaData>
              <BookMetaData my={10} heading="Authors">
                {contributors}
              </BookMetaData>
              <ReadingLevel>Level {book.readingLevel}</ReadingLevel>
            </Box>
          </Flex>

          <Box mt={20} mb={20}>
            <BookDescription>{book.description}</BookDescription>
          </Box>
          <Flex justify="space-around" mb={20}>
            <Button>Read</Button>
          </Flex>

          <Flex wrap>
            <Box w={[1, 1 / 2]}>
              <Card borderRadius={['4px 4px 0 0', '4px 0 0 0']}>
                <CardAction>
                  <MdLanguage /> Book language: {book.language.name}
                </CardAction>
                <hr />
                This book is available in {book.availableLanguages.length} other
                languages
              </Card>
              <Box mt={1} mb={1}>
                <Card borderRadius={0}>
                  <CardAction>
                    <MdFileDownload /> Download book
                  </CardAction>
                </Card>
                <Card borderRadius={[0, '0 0 0 4px']}>
                  <CardAction>
                    <MdTranslate /> Translate book
                  </CardAction>
                </Card>
              </Box>
            </Box>
            <Box w={[1, 1 / 2]} mb={1}>
              <Card
                style={{ height: '100%' }}
                borderRadius={['0 0 4px 4px', '0 4px 4px 0']}
              >
                {book.datePublished && (
                  <BookMetaData heading="Published">
                    <DateFormat value={new Date(book.datePublished)} />
                  </BookMetaData>
                )}
                <BookMetaData heading="License">
                  <a href={book.license.url}>{book.license.description}</a>
                </BookMetaData>
                <BookMetaData heading="categories">{categories}</BookMetaData>
              </Card>
            </Box>
          </Flex>
        </Container>

        <Hero>
          <Container>
            <SimilarLink href="">Similar</SimilarLink>
            <HorizontalBookList books={this.props.similar} />
          </Container>
        </Hero>
      </div>
    );
  }
}

export default withI18n(BookPage);
