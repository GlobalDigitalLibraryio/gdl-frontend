// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import { DateFormat, Trans, Plural } from 'lingui-react';
import fetch from 'isomorphic-unfetch';
import { MdLanguage, MdTranslate, MdFileDownload } from 'react-icons/lib/md';
import styled from 'styled-components';
import { Manager, Target, Popper } from 'react-popper';
import Downshift from 'downshift';
import { responsiveStyle } from 'styled-system';
import type { Book } from '../../types';
import withI18n from '../../hocs/withI18n';
import Title from '../../components/Title';
import Box from '../../components/Box';
import Flex from '../../components/Flex';
import Navbar from '../../components/Navbar';
import CardBase, {
  CardAction,
  CardDropdown,
  CardDropdownItem,
  CardPopoverArrow,
} from '../../components/Card';
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

    const availableLanguages = book.availableLanguages.length;

    return (
      <div>
        <Meta
          title={book.title}
          description={book.description}
          image={book.coverPhoto.large}
        />
        <Navbar />

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
              <ReadingLevel>
                <Trans>Level {book.readingLevel}</Trans>
              </ReadingLevel>
            </Box>
          </Flex>

          <Box mt={20} mb={20}>
            <BookDescription>{book.description}</BookDescription>
          </Box>
          <Flex justify="space-around" mb={20}>
            <Button>
              <Trans>Read</Trans>
            </Button>
          </Flex>

          <Flex wrap>
            <Box w={[1, 1 / 2]}>
              <Card borderRadius={['4px 4px 0 0', '4px 0 0 0']}>
                <CardAction>
                  <MdLanguage />{' '}
                  <Trans>Book language: {book.language.name}</Trans>
                </CardAction>
                <hr />
                <Plural
                  id="availableLanguages"
                  value={availableLanguages}
                  one="This book is available in another language"
                  other="This book is available in # other languages"
                />
              </Card>
              <Box mt={1} mb={1}>
                <Manager>
                  <Downshift>
                    {({ getButtonProps, isOpen, getItemProps }) => (
                      <div>
                        <Card borderRadius={0}>
                          <Target>
                            <CardAction {...getButtonProps()} href="">
                              <MdFileDownload /> <Trans>Download book</Trans>
                            </CardAction>
                          </Target>
                          {isOpen && (
                            <Popper
                              placement="bottom"
                              style={{ width: '100%', zIndex: 9999 }}
                            >
                              <CardDropdown>
                                <CardDropdownItem
                                  href={book.downloads.epub}
                                  {...getItemProps({ item: 'epub' })}
                                >
                                  <MdFileDownload />{' '}
                                  <Trans>Download ePub</Trans>
                                </CardDropdownItem>
                                <CardDropdownItem
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
                    <MdTranslate /> <Trans>Translate book</Trans>
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
            <SimilarLink href="">
              <Trans>Similar</Trans>
            </SimilarLink>
            <HorizontalBookList books={this.props.similar} />
          </Container>
        </Hero>
      </div>
    );
  }
}

export default withI18n(BookPage);
