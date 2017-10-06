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
    let level = query[levelQuery];
    const language = query[langQuery];

    // Fetch these first, cause they don't use the reading level
    const [editorPicksRes, levelsRes, languagesRes] = await Promise.all([
      fetch(`${env.bookApiUrl}/book-api/v1/editorpicks/${language || ''}`),
      fetch(`${env.bookApiUrl}/book-api/v1/levels/${language || ''}`),
      fetch(`${env.bookApiUrl}/book-api/v1/languages`),
    ]);

    const [editorPicks, levels, languages] = await Promise.all([
      editorPicksRes.json(),
      levelsRes.json(),
      languagesRes.json(),
    ]);

    // If the levels doesn't include the level from the query param, nullify it, so we don't apply the filter to the API call and get empty results
    if (!levels.includes(level)) {
      level = null;
    }

    // Now that we've cleaned up the reading level in the query param, fetch the rest
    const [popluarRes, justArrivedRes] = await Promise.all([
      fetch(
        `${env.bookApiUrl}/book-api/v1/books/${language ||
          ''}?sort=popular&page-size=${BOOKS_PAGE_SIZE}${level
          ? `&reading-level=${level}`
          : ''}`,
      ),
      fetch(
        `${env.bookApiUrl}/book-api/v1/books/${language ||
          ''}?sort=-arrivaldate&page-size=${BOOKS_PAGE_SIZE}${level
          ? `&reading-level=${level}`
          : ''}`,
      ),
    ]);

    const [popular, justArrived] = await Promise.all([
      popluarRes.json(),
      justArrivedRes.json(),
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

  // Generate the query param object for the links in the level and language filter.
  // Keeps existing value for the other type of query param, and removes undefined values because we don't want ?lang=eng&level=undefined
  makeParamsObj({ level, language }: { level?: ?string, language?: string }) {
    const params = {
      [langQuery]: language || this.props.languageFilter.code,
      [levelQuery]: level || this.props.levelFilter,
    };

    if (!params[langQuery]) {
      delete params[langQuery];
    }

    if (!params[levelQuery]) {
      delete params[levelQuery];
    }

    return params;
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
          <Container mw="1075px" px={[0, 15]}>
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
                    params={this.makeParamsObj({ language: language.code })}
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
              {({ getItemProps, selectedItem, highlightedIndex }) => [
                <Link
                  key="All"
                  passHref
                  route="books"
                  params={{
                    [langQuery]: languageFilter.code,
                  }}
                >
                  <ToolbarDropdownItem
                    {...getItemProps({ item: 'all' })}
                    isActive={highlightedIndex === 0}
                    isSelected={!selectedItem}
                  >
                    <MdCheck /> All levels
                  </ToolbarDropdownItem>
                </Link>,
                ...levels.map((level, index) => (
                  <Link
                    key={level}
                    passHref
                    route="books"
                    params={this.makeParamsObj({
                      level: levelFilter,
                    })}
                  >
                    <ToolbarDropdownItem
                      {...getItemProps({ item: level })}
                      isActive={highlightedIndex === index + 1}
                      isSelected={selectedItem === level}
                    >
                      <MdCheck /> Level {level}
                    </ToolbarDropdownItem>
                  </Link>
                )),
              ]}
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
              <Card is="a" style={{ display: 'block', color: '#444' }}>
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
              Just arrived in {languageFilter.name} <MdKeyboardArrowRight />
            </Title>
            <HorizontalBookList books={this.props.popular} mt={20} />
          </Container>
        </Hero>

        <Hero borderTop borderBottom>
          <Container>
            <Title href="" is="a" upperCase fontSize={[18, 22]}>
              Popular in {languageFilter.name} <MdKeyboardArrowRight />
            </Title>
            <HorizontalBookList books={this.props.justArrived} mt={20} />
          </Container>
        </Hero>
      </div>
    );
  }
}

export default defaultPage(BooksPage);
