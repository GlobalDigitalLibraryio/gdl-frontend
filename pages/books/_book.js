// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { DateFormat, Trans } from 'lingui-react';
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
import Card from '../../components/Card';
import BookCover from '../../components/BookCover';
import ButtonLink from '../../components/ButtonLink';
import Container from '../../components/Container';
import Meta from '../../components/Meta';
import BookList from '../../components/BookList';

type Props = {
  book: RemoteData<Book>,
  similar: RemoteData<{
    results: Array<Book>,
  }>,
};

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

        <Container py={[15, 20]}>
          <Flex>
            <Box w={2 / 5}>
              <BookCover book={book} />
            </Box>
            <Card textAlign="center" w={3 / 5} p={[15, 20]}>
              <H1 fontSize={[28, 38]}>{book.title}</H1>
              <P fontSize={[12, 14]}>
                <Trans>
                  from <span>{book.publisher.name}</span>
                </Trans>
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
              <P fontSize={[14, 16]} lineHeight="1.5">
                {book.description}
              </P>
            </Card>
          </Flex>
        </Container>
        {/* <Container>
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
          </Container> */}
        <Container py={[15, 20]}>
          <Card p={[15, 20]}>
            <Flex display={['block', 'flex']}>
              <Box w={[1, 0.45]}>
                {book.datePublished && [
                  <H6 key="header">
                    <Trans>Published</Trans>
                  </H6>,
                  <DateFormat
                    key="value"
                    value={new Date(book.datePublished)}
                  />,
                ]}
                <H6>
                  <Trans>Authors</Trans>
                </H6>
                {contributors}
              </Box>
              <Box w={[1, 0.45]}>
                <H6>
                  <Trans>License</Trans>
                </H6>
                <A href={book.license.url}>{book.license.description}</A>
                {book.categories.length > 0 && [
                  <H6>
                    <Trans>categories</Trans>
                  </H6>,
                  { categories },
                ]}
              </Box>
              <Box w={0.15}>Level 1</Box>
            </Flex>
          </Card>
          {/* <CardBase>
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
                </CardBase> */}

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
