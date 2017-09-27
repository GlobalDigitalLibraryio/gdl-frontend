// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import fetch from 'isomorphic-unfetch';
import { MdKeyboardArrowRight, MdCheck } from 'react-icons/lib/md';
import type { Book, Language } from '../../types';
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
import Toolbar, {
  ToolbarItem,
  ToolbarDropdownItem,
} from '../../components/Toolbar';

const BOOKS_PAGE_SIZE = 5;

type Props = {
  editorPick: Book,
  popular: Array<Book>,
  justArrived: Array<Book>,
  levels: Array<string>,
  languages: Array<Language>,
  languageFilter: Language,
  levelFilter: ?string,
};

const langQuery = 'lang';
const levelQuery = 'level';

class BooksPage extends React.Component<Props> {
  static async getInitialProps({ query }) {
    // Read the level and language from the query parameters
    const level = query[levelQuery];
    const language = query[langQuery];

    const [
      editorPicksRes,
      popluarRes,
      justArrivedRes,
      levelsRes,
      languagesRes,
    ] = await Promise.all([
      fetch(`${env.bookApiUrl}/book-api/v1/editorpicks/${language || ''}`),
      fetch(
        `${env.bookApiUrl}/book-api/v1/books/${language ||
          ''}?sort=popular&page-size=${BOOKS_PAGE_SIZE}&reading-level=${level}`,
      ),
      fetch(
        `${env.bookApiUrl}/book-api/v1/books/${language ||
          ''}?sort=arrivaldate&page-size=${BOOKS_PAGE_SIZE}&reading-level=${level}`,
      ),
      fetch(`${env.bookApiUrl}/book-api/v1/levels`),
      fetch(`${env.bookApiUrl}/book-api/v1/languages`),
    ]);

    const [
      editorPicks,
      popular,
      justArrived,
      levels,
      languages,
    ] = await Promise.all([
      editorPicksRes.json(),
      popluarRes.json(),
      justArrivedRes.json(),
      levelsRes.json(),
      languagesRes.json(),
    ]);

    return {
      editorPick: editorPicks[0], // This returns an array. For now we only want a single book
      popular: popular.results,
      justArrived: justArrived.results,
      languageFilter: popular.language,
      levelFilter: level,
      languages,
      levels,
    };
  }

  render() {
    const {
      editorPick,
      languages,
      levels,
      languageFilter,
      levelFilter,
    } = this.props;

    return (
      <div>
        <Meta title="Books" description="Enjoy all the books" />
        <Navbar />

        <Toolbar>
          <Container mw="1075px">
            <ToolbarItem
              id="langFilter"
              text="Language"
              selectedItem={languageFilter.code}
            >
              {({ getItemProps, selectedItem, highlightedIndex }) =>
                languages.map((language, index) => (
                  <Link
                    key={language.code}
                    route="books"
                    passHref
                    params={{
                      [langQuery]: language.code,
                      [levelQuery]: levelFilter,
                    }}
                  >
                    <ToolbarDropdownItem
                      {...getItemProps({ item: language.code })}
                      isActive={highlightedIndex === index}
                      isSelected={selectedItem === language.code}
                    >
                      <MdCheck />
                      {language.name}
                    </ToolbarDropdownItem>
                  </Link>
                ))}
            </ToolbarItem>

            <ToolbarItem
              id="levelFilter"
              text="Level"
              selectedItem={levelFilter}
            >
              {({ getItemProps, selectedItem, highlightedIndex }) =>
                levels.map((level, index) => (
                  <Link
                    key={level}
                    passHref
                    route="books"
                    params={{
                      [levelQuery]: level,
                      [langQuery]: languageFilter.code,
                    }}
                  >
                    <ToolbarDropdownItem
                      {...getItemProps({ item: level })}
                      isActive={highlightedIndex === index}
                      isSelected={selectedItem === level}
                    >
                      <MdCheck /> Level {level}
                    </ToolbarDropdownItem>
                  </Link>
                ))}
            </ToolbarItem>
          </Container>
        </Toolbar>

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
