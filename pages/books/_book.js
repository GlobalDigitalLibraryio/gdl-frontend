// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import { Trans, DateFormat } from 'lingui-react';
import fetch from 'isomorphic-unfetch';
import styled from 'styled-components';
import { Flex } from 'grid-styled';
import type { Book } from '../../types';
import withI18n from '../../hocs/withI18n';
import Title from '../../components/Title';
import Box from '../../components/Box';
import Navbar, { NavItem, HamburgerButton } from '../../components/Navbar';
import Card, { CardContent } from '../../components/Card';
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

// TODO: Remove datefallback in render when API returns publishedDate

const BookDescription = styled.div`text-align: center;`;

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
      similar,
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
            <Box w={1 / 2}>
              <BookCover book={book} />
            </Box>
            <Box w={1 / 2} fontSize="14px">
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
              <Card>
                <CardContent>Book language: {book.language.name}</CardContent>
              </Card>
              <Box mt={1} mb={1}>
                <Card>
                  <CardContent>Download book</CardContent>
                </Card>
                <Card>
                  <CardContent>Translate book</CardContent>
                </Card>
              </Box>
            </Box>
            <Box w={[1, 1 / 2]} mb={1}>
              <Card style={{ height: '100%' }}>
                <CardContent>
                  {book.datePublished && (
                    <BookMetaData heading="Published">
                      <DateFormat value={new Date(book.datePublished)} />
                    </BookMetaData>
                  )}
                  <BookMetaData heading="License">
                    <a href={book.license.url}>{book.license.description}</a>
                  </BookMetaData>
                  <BookMetaData heading="categories">{categories}</BookMetaData>
                </CardContent>
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
