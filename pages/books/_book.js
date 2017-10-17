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
import { Manager, Target, Popper } from 'react-popper';
import Downshift from 'downshift';
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
import CardBase, {
  CardAction,
  CardDropdown,
  CardDropdownItem,
} from '../../components/Card';
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

// Extend the regular Card, allowing us to alter the border radius responsively
const Card = CardBase.extend`
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
            <CardBase style={{ textAlign: 'center' }}>
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
            </CardBase>
          </Container>
        </Hero>
        <Container pt={[15, 25]}>
          <Flex wrap>
            <Box w={[1, 1 / 2]}>
              <Manager>
                <Downshift>
                  {({ getButtonProps, isOpen, getItemProps }) => (
                    <div>
                      <Card borderRadius={['4px 4px 0 0', '4px 0 0 0']}>
                        <Target>
                          <CardAction {...getButtonProps()} href="">
                            <MdLanguage />{' '}
                            <Trans>Book language: {book.language.name}</Trans>
                            {isOpen ? (
                              <MdKeyboardArrowUp />
                            ) : (
                              <MdKeyboardArrowDown />
                            )}
                          </CardAction>
                        </Target>
                        <hr />
                        <Plural
                          value={availableLanguages}
                          _0="This book is not available in other languages"
                          one="This book is available in another language"
                          other="This book is available in # other languages"
                          render="small"
                        />
                        {isOpen && (
                          <Popper
                            placement="bottom"
                            style={{ width: '100%', zIndex: 9999 }}
                          >
                            <CardDropdown>
                              {book.availableLanguages
                                .filter(
                                  lang => lang.code !== book.language.code,
                                )
                                .map(lang => (
                                  <Link
                                    passHref
                                    route="book"
                                    key={lang.code}
                                    params={{
                                      id: book.id,
                                      lang: lang.code,
                                    }}
                                  >
                                    <CardDropdownItem
                                      href={book.downloads.epub}
                                      {...getItemProps({ item: 'epub' })}
                                    >
                                      {lang.name}
                                    </CardDropdownItem>
                                  </Link>
                                ))}
                            </CardDropdown>
                          </Popper>
                        )}
                      </Card>
                    </div>
                  )}
                </Downshift>
              </Manager>
              <Box mt={1} mb={1}>
                <Manager>
                  <Downshift>
                    {({ getButtonProps, isOpen, getItemProps }) => (
                      <div>
                        <Card borderRadius={0}>
                          <Target>
                            <CardAction {...getButtonProps()} href="">
                              <MdFileDownload /> <Trans>Download book</Trans>
                              {isOpen ? (
                                <MdKeyboardArrowUp />
                              ) : (
                                <MdKeyboardArrowDown />
                              )}
                            </CardAction>
                          </Target>
                          {isOpen && (
                            <Popper
                              placement="bottom"
                              style={{ width: '100%', zIndex: 9999 }}
                            >
                              <CardDropdown>
                                <CardDropdownItem
                                  onClick={event => event.stopPropagation()}
                                  href={book.downloads.epub}
                                  {...getItemProps({ item: 'epub' })}
                                >
                                  <MdFileDownload />{' '}
                                  <Trans>Download ePub</Trans>
                                </CardDropdownItem>
                                <CardDropdownItem
                                  onClick={event => event.stopPropagation()}
                                  href={book.downloads.pdf}
                                  {...getItemProps({ item: 'pdf' })}
                                >
                                  <MdFileDownload /> <Trans>Download PDF</Trans>
                                </CardDropdownItem>
                              </CardDropdown>
                            </Popper>
                          )}
                        </Card>
                      </div>
                    )}
                  </Downshift>
                </Manager>
                <Card borderRadius={[0, '0 0 0 4px']}>
                  <CardAction>
                    <MdTranslate /> <Trans>Translate book</Trans>{' '}
                    <MdKeyboardArrowRight />
                  </CardAction>
                </Card>
              </Box>
            </Box>
            <Box w={[1, 1 / 2]} mb={1}>
              <Card
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
              </Card>
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
