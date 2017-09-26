// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import fetch from 'isomorphic-unfetch';
import { MdKeyboardArrowRight } from 'react-icons/lib/md';
import type { Book } from '../../types';
import defaultPage from '../../hocs/defaultPage';
import Title from '../../components/Title';
import Box from '../../components/Box';
import Flex from '../../components/Flex';
import Navbar from '../../components/Navbar';
import env from '../../env';
import Card from '../../components/Card';
import BookCover from '../../components/BookCover';
import { Link } from '../../routes';
import Container from '../../components/Container';
import Hero from '../../components/Hero';
import Meta from '../../components/Meta';
import HorizontalBookList from '../../components/HorizontalBookList';

const BOOKS_PAGE_SIZE = 5;

type Props = {
  editorPick: Book,
  popular: Array<Book>,
  justArrived: Array<Book>,
};

class BooksPage extends React.Component<Props> {
  static async getInitialProps() {
    const [editorPicksRes, popluarRes, justArrivedRes] = await Promise.all([
      fetch(`${env.bookApiUrl}/book-api/v1/editorpicks/`),
      fetch(
        `${env.bookApiUrl}/book-api/v1/books?sort=popular&page-size=${BOOKS_PAGE_SIZE}`,
      ),
      fetch(
        `${env.bookApiUrl}/book-api/v1/books?sort=arrivalDate&page-size=${BOOKS_PAGE_SIZE}`,
      ),
    ]);

    const [editorPicks, popular, justArrived] = await Promise.all([
      editorPicksRes.json(),
      popluarRes.json(),
      justArrivedRes.json(),
    ]);

    return {
      editorPick: editorPicks[0], // This returns an array. For now we only want a single book
      popular: popular.results,
      justArrived: justArrived.results,
    };
  }

  render() {
    const { editorPick } = this.props;

    return (
      <div>
        <Meta title="Books" description="Enjoy all the books" />
        <Navbar />
        <Hero colorful>
          <Container>
            <Link
              route="book"
              params={{ id: editorPick.id, lang: editorPick.language.code }}
              passHref
            >
              <Card is="a" style={{ display: 'block' }}>
                <Flex>
                  <BookCover book={editorPick} ml="auto" w={1 / 2} mr={6} />
                  <Box w={1 / 2} ml={6}>
                    <Title upperCase fontSize={18}>
                      Editors pick
                    </Title>
                    <Title fontSize={16}>{editorPick.title}</Title>
                    {editorPick.description}
                  </Box>
                </Flex>
              </Card>
            </Link>
          </Container>
        </Hero>
        <Hero>
          <Container>
            <Title href="" is="a" upperCase fontSize={[18, 22]}>
              Just arrived in english <MdKeyboardArrowRight />
            </Title>
            <HorizontalBookList books={this.props.popular} mt={20} />
          </Container>
        </Hero>
        <Hero borderTop borderBottom>
          <Container>
            <Title href="" is="a" upperCase fontSize={[18, 22]}>
              Popular in english <MdKeyboardArrowRight />
            </Title>
            <HorizontalBookList books={this.props.justArrived} mt={20} />
          </Container>
        </Hero>
      </div>
    );
  }
}

export default defaultPage(BooksPage);
