// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import dynamic from 'next/dynamic';
import { DateFormat, Trans, Plural } from 'lingui-react';
import fetch from 'isomorphic-unfetch';
import {
  MdLanguage,
  MdTranslate,
  MdFileDownload,
  MdKeyboardArrowRight,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from 'react-icons/lib/md';
import styled from 'styled-components';
import { responsiveStyle } from 'styled-system';
import type { Book } from '../../types';
import defaultPage from '../../hocs/defaultPage';
import { Link, Router } from '../../routes';
import Title from '../../components/Title';
import Box from '../../components/Box';
import Flex from '../../components/Flex';
import Navbar from '../../components/Navbar';
import ReadingLevel from '../../components/ReadingLevel';
import env from '../../env';
import A from '../../components/A';
import Card from '../../components/Card';
import CardDropdown, { CardDropdownItem } from '../../components/CardDropdown';
import BookCover from '../../components/BookCover';
import Button from '../../components/Button';
import Heading from '../../components/Heading';
import Container from '../../components/Container';
import Hero from '../../components/Hero';
import Meta from '../../components/Meta';
import HorizontalBookList from '../../components/HorizontalBookList';

// Number of similar books to fetch
const SIMILAR_BOOKS_PAGE_SIZE = 5;

// Download the Reader component on demand
const Reader = dynamic(import('../../components/Reader'));

type Props = {
  book: Book,
  similar: Array<Book>,
  chapter?: number,
  url: {
    query: {
      chapter?: string,
    },
  },
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

const BookDescription = styled.div`
  margin-bottom: 15px;
`;

const DropdownAction = styled.a`
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  & svg:nth-of-type(1) {
    margin-right: 10px;
  }
  & svg:nth-of-type(2) {
    margin-left: auto;
  }
`;

// Extend the regular Card, allowing us to alter the border radius responsively
const CardBorderRadius = Card.extend`
  ${responsiveStyle('border-radius', 'borderRadius')};
`;

class BookPage extends React.Component<Props> {
  static async getInitialProps({ query }) {
    const [bookRes, similarRes] = await Promise.all([
      fetch(`${env.bookApiUrl}/book-api/v1/books/${query.lang}/${query.id}`),
      fetch(
        `${env.bookApiUrl}/book-api/v1/books/${query.lang}/similar/${query.id}?page-size=${SIMILAR_BOOKS_PAGE_SIZE}`,
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
        <A href="" key={contributor.id}>
          {contributor.name}
        </A>
      ))
      .map((item, index) => [index > 0 && ', ', item]);

    const categories = book.categories
      .map(category => (
        <A href="" key={category.id}>
          {category.name}
        </A>
      ))
      .map((item, index) => [index > 0 && ', ', item]);

    const availableLanguages = book.availableLanguages.length - 1;

    return (
      <div>
        <Meta
          title={book.title}
          description={book.description}
          image={book.coverPhoto ? book.coverPhoto.large : null}
        />
        <Navbar />

        {this.props.url.query.chapter && (
          <Reader
            book={book}
            chapter={this.props.url.query.chapter}
            onClose={() =>
              Router.pushRoute(
                'book',
                {
                  id: book.id,
                  lang: book.language.code,
                },
                { shallow: true },
              )}
          />
        )}

        <Hero colorful>
          <Container>
            <Card style={{ textAlign: 'center' }}>
              <Box>
                <Title fontSize={[28, 38]} align="center">
                  {book.title}
                </Title>
                <Trans>
                  from <A href="">{book.publisher.name}</A>
                </Trans>
              </Box>
              <BookCover book={book} mx="auto" my={15} />
              <Box>
                <BookDescription>{book.description}</BookDescription>
                <Button
                  onClick={() =>
                    Router.pushRoute(
                      'book',
                      {
                        id: book.id,
                        lang: book.language.code,
                        chapter: 1,
                      },
                      { shallow: true },
                    )}
                >
                  <Trans>Read</Trans>
                </Button>
              </Box>
            </Card>
          </Container>
        </Hero>
        <Container pt={[15, 25]}>
          <Flex wrap>
            <Box w={[1, 1 / 2]}>
              <CardBorderRadius borderRadius={['4px 4px 0 0', '4px 0 0 0']}>
                <CardDropdown
                  id="book-language"
                  renderTarget={(getTargetProps, isOpen) => (
                    <DropdownAction href="" {...getTargetProps()}>
                      <MdLanguage />{' '}
                      <Trans>Book language: {book.language.name}</Trans>
                      {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                    </DropdownAction>
                  )}
                >
                  {({ getItemProps, highlightedIndex }) =>
                    book.availableLanguages
                      .filter(lang => lang.code !== book.language.code)
                      .map((lang, index) => (
                        <Link
                          passHref
                          route="book"
                          key={lang.code}
                          params={{ id: book.id, lang: lang.code }}
                        >
                          <CardDropdownItem
                            {...getItemProps({ item: lang.code })}
                            isActive={highlightedIndex === index}
                          >
                            {lang.name}
                          </CardDropdownItem>
                        </Link>
                      ))}
                </CardDropdown>
                <hr />
                <Plural
                  value={availableLanguages}
                  _0="This book is not available in other languages"
                  one="This book is available in another language"
                  other="This book is available in # other languages"
                  render="small"
                />
              </CardBorderRadius>
              <Box mt={1} mb={1}>
                <CardBorderRadius borderRadius={0}>
                  <CardDropdown
                    id="download-book"
                    renderTarget={(getTargetProps, isOpen) => (
                      <DropdownAction {...getTargetProps()} href="">
                        <MdFileDownload /> <Trans>Download book</Trans>
                        {isOpen ? (
                          <MdKeyboardArrowUp />
                        ) : (
                          <MdKeyboardArrowDown />
                        )}
                      </DropdownAction>
                    )}
                  >
                    {({ getItemProps, highlightedIndex }) => [
                      <CardDropdownItem
                        key="epub"
                        onClick={event => event.stopPropagation()}
                        href={book.downloads.epub}
                        {...getItemProps({ item: 'epub' })}
                        isActive={highlightedIndex === 0}
                      >
                        <MdFileDownload /> <Trans>Download ePub</Trans>
                      </CardDropdownItem>,
                      <CardDropdownItem
                        key="pdf"
                        onClick={event => event.stopPropagation()}
                        href={book.downloads.pdf}
                        {...getItemProps({ item: 'pdf' })}
                        isActive={highlightedIndex === 1}
                      >
                        <MdFileDownload /> <Trans>Download PDF</Trans>
                      </CardDropdownItem>,
                    ]}
                  </CardDropdown>
                </CardBorderRadius>
                <CardBorderRadius borderRadius={[0, '0 0 0 4px']}>
                  <DropdownAction>
                    <MdTranslate /> <Trans>Translate book</Trans>{' '}
                    <MdKeyboardArrowRight />
                  </DropdownAction>
                </CardBorderRadius>
              </Box>
            </Box>
            <Box w={[1, 1 / 2]} mb={1}>
              <CardBorderRadius
                style={{ height: '100%' }}
                borderRadius={['0 0 4px 4px', '0 4px 4px 0']}
              >
                <ReadingLevel style={{ float: 'right' }}>
                  <Trans id="level">Level {book.readingLevel}</Trans>
                </ReadingLevel>
                {book.datePublished && (
                  <BookMetaData heading="Published">
                    <DateFormat value={new Date(book.datePublished)} />
                  </BookMetaData>
                )}
                <BookMetaData my={10} heading="Authors">
                  {contributors}
                </BookMetaData>
                <BookMetaData heading="License">
                  <A href={book.license.url}>{book.license.description}</A>
                </BookMetaData>
                <BookMetaData heading="categories">{categories}</BookMetaData>
              </CardBorderRadius>
            </Box>
          </Flex>
        </Container>

        <Hero borderTop borderBottom>
          <Container>
            <Title href="" is="a" upperCase fontSize={[18, 22]}>
              <Trans>Similar</Trans> <MdKeyboardArrowRight />
            </Title>
            <HorizontalBookList books={this.props.similar} mt={20} />
          </Container>
        </Hero>
      </div>
    );
  }
}

export default defaultPage(BookPage);
