// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { DateFormat, Trans, Plural } from 'lingui-react';
import {
  MdLanguage,
  MdTranslate,
  MdFileDownload,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from 'react-icons/lib/md';
import styled from 'styled-components';
import { fetchBook, fetchSimilarBooks } from '../../fetch';
import type { Book, RemoteData } from '../../types';
import defaultPage from '../../hocs/defaultPage';
import { Link } from '../../routes';
import Box from '../../components/Box';
import Flex from '../../components/Flex';
import Layout from '../../components/Layout';
import ReadingLevel from '../../components/ReadingLevel';
import A from '../../components/A';
import H3 from '../../components/H3';
import H1 from '../../components/H1';
import H6 from '../../components/H6';
import P from '../../components/P';
import Card, { CardBase } from '../../components/Card';
import CardDropdown, { CardDropdownItem } from '../../components/CardDropdown';
import BookCover from '../../components/BookCover';
import Button from '../../components/Button';
import Container from '../../components/Container';
import Hero from '../../components/Hero';
import Meta from '../../components/Meta';
import BookList from '../../components/BookList';
import theme from '../../style/theme';

type Props = {
  book: RemoteData<Book>,
  similar: RemoteData<{
    results: Array<Book>,
  }>,
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
    <H6>{heading}</H6>
    {children}
  </Box>
);

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

// Specially desgined for "underlining" everything but the first icon of the download book link
const Hr = styled.hr`
  background-color: ${theme.colors.grayLight};
  height: 1px;
  border: none;
  margin-left: 33px;
  margin-right: -15px;
`;

// Extend the regular Card, allowing us to alter the border radius responsively
const CardNested = Card.extend`
  border-radius: 0;
`;

const Separator = styled.div`
  height: 4px;
  background-color: ${theme.colors.grayLighter};
`;

class BookPage extends React.Component<Props> {
  static async getInitialProps({ query }) {
    const [book, similar] = await Promise.all([
      fetchBook(query.id, query.lang),
      fetchSimilarBooks(query.id, query.lang),
    ]);

    return {
      book,
      similar,
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

    const availableLanguages = book.availableLanguages.length - 1;

    return (
      <Layout currentPage={book.title} language={book.language}>
        <Meta
          title={book.title}
          description={book.description}
          image={book.coverPhoto ? book.coverPhoto.large : null}
        />

        <Hero colorful py={[15, 40]}>
          <Container>
            <Card textAlign={['center', 'left']} py={20} px={[15, 20]}>
              <Flex flexDirection={['column', 'row']}>
                <BookCover book={book} mr={20} isHiddenMobile flex="0 0 auto" />
                <Box>
                  <H1 fontSize={[28, 38]}>{book.title}</H1>
                  <P fontSize={[12, 14]}>
                    <Trans>
                      from <span>{book.publisher.name}</span>
                    </Trans>
                  </P>
                  <BookCover book={book} mx="auto" isHiddenTablet />
                  <P fontSize={[14, 16]}>{book.description}</P>
                  <Link
                    route="read"
                    params={{ id: book.id, lang: book.language.code }}
                  >
                    <Button>
                      <Trans>Read</Trans>
                    </Button>
                  </Link>
                </Box>
              </Flex>
            </Card>
          </Container>
        </Hero>
        <Container py={[15, 20]}>
          <CardBase>
            <Flex wrap>
              <Flex w={[1, 1 / 2]} column>
                <CardNested p={15}>
                  <CardDropdown
                    id="book-language"
                    renderTarget={(getTargetProps, isOpen) => (
                      <DropdownAction href="" {...getTargetProps()}>
                        <MdLanguage />{' '}
                        <Trans>Book language: {book.language.name}</Trans>
                        {isOpen ? (
                          <MdKeyboardArrowUp />
                        ) : (
                          <MdKeyboardArrowDown />
                        )}
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
                        ))
                    }
                  </CardDropdown>
                  <Hr />
                  <Plural
                    value={availableLanguages}
                    _0="This book is not available in other languages"
                    one="This book is available in another language"
                    other="This book is available in # other languages"
                    render="small"
                  />
                </CardNested>
                <Separator />
                <CardNested p={15}>
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
                </CardNested>
                <CardNested flex="1 0 auto" p={15}>
                  <DropdownAction>
                    <MdTranslate /> <Trans>Translate book</Trans>
                  </DropdownAction>
                </CardNested>
              </Flex>
              <Box w={[1, 1 / 2]}>
                <CardNested
                  fontSize={[13, 15]}
                  p={15}
                  style={{ height: '100%' }}
                >
                  <ReadingLevel
                    style={{ float: 'right' }}
                    level={book.readingLevel}
                  />
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
                  {book.categories.length > 0 && (
                    <BookMetaData heading="categories">
                      {categories}
                    </BookMetaData>
                  )}
                </CardNested>
              </Box>
            </Flex>
          </CardBase>
        </Container>

        <Hero pb={[15, 22]}>
          <Container>
            <H3>
              <Trans>Similar</Trans>
            </H3>
            <BookList books={similar.results} mt={20} />
          </Container>
        </Hero>
      </Layout>
    );
  }
}

export default defaultPage(BookPage);
