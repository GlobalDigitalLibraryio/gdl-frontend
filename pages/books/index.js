// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import fetch from 'isomorphic-unfetch';
import { Trans } from 'lingui-react';
import type { I18n } from 'lingui-i18n';
import { MdCheck } from 'react-icons/lib/md';
import type { Book, Language } from '../../types';
import defaultPage from '../../hocs/defaultPage';
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
import P from '../../components/P';
import H3 from '../../components/H3';
import H4 from '../../components/H4';
import Toolbar, {
  ToolbarItem,
  ToolbarDropdownItem,
} from '../../components/Toolbar';

const BOOKS_PAGE_SIZE = 5;
const LANG_QUERY = 'lang';

type Props = {
  editorPick: Book,
  popular: Array<Book>,
  justArrived: Array<Book>,
  levels: Array<string>,
  languages: Array<Language>,
  languageFilter: Language,
  i18n: I18n,
  booksByLevel: Array<Array<Book>>,
};

class BooksPage extends React.Component<Props> {
  static async getInitialProps({ query }) {
    const language = query[LANG_QUERY];

    // Fetch these first, cause they don't use the reading level
    const [
      editorPicksRes,
      levelsRes,
      languagesRes,
      justArrivedRes,
    ] = await Promise.all([
      fetch(`${env.bookApiUrl}/book-api/v1/editorpicks/${language || ''}`),
      fetch(`${env.bookApiUrl}/book-api/v1/levels/${language || ''}`),
      fetch(`${env.bookApiUrl}/book-api/v1/languages`),
      fetch(
        `${env.bookApiUrl}/book-api/v1/books/${language ||
          ''}?sort=popular&page-size=${BOOKS_PAGE_SIZE}`,
      ),
    ]);

    const [editorPicks, levels, languages, justArrived] = await Promise.all([
      editorPicksRes.json(),
      levelsRes.json(),
      languagesRes.json(),
      justArrivedRes.json(),
    ]);

    const booksByLevelsRes = await Promise.all(
      levels.map(level =>
        fetch(
          `${env.bookApiUrl}/book-api/v1/books/${language ||
            ''}?sort=-arrivaldate&page-size=${BOOKS_PAGE_SIZE}&reading-level=${level}`,
        ),
      ),
    );

    const booksByLevel = await Promise.all(
      booksByLevelsRes.map(res => res.json()),
    );

    return {
      editorPick: editorPicks[0], // This returns an array. For now we only want a single book
      justArrived: justArrived.results, // currently we are only interested in the array, not all the other metadata (paging etc.)
      languageFilter: justArrived.language,
      languages,
      levels,
      booksByLevel: booksByLevel.map(books => books.results), // currently we are only interested in the array, not all the other metadata (paging etc.)
    };
  }

  render() {
    const {
      editorPick,
      languages,
      languageFilter,
      i18n,
      levels,
      booksByLevel,
    } = this.props;

    return (
      <div>
        <Meta title={i18n.t`Books`} description={i18n.t`Enjoy all the books`} />
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
                    params={{ [LANG_QUERY]: language.code }}
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
          </Container>
        </Toolbar>

        <Hero
          colorful
          h={['237px', '390px']}
          pt={['15px', '40px']}
          pb={['42px', '54px']}
        >
          <Container>
            <Link
              route="book"
              params={{ id: editorPick.id, lang: editorPick.language.code }}
            >
              <a>
                <Card
                  h={['180px', '295px']}
                  pl={['15px', '20px']}
                  pr={['15px', '80px']}
                  pt={['15px', '20px']}
                >
                  <Flex>
                    <BookCover
                      book={editorPick}
                      h={['148px', '247px']}
                      w={['120px', '200px']}
                      mr={['15px', '20px']}
                      flex="0 0 auto"
                    />
                    <Box>
                      <H3>
                        <Trans>Editor’s pick</Trans>
                      </H3>
                      <H4>{editorPick.title}</H4>
                      <P fontSize={[12, 16]} lineHeight={[18, 24]}>
                        {editorPick.description}
                      </P>
                    </Box>
                  </Flex>
                </Card>
              </a>
            </Link>
          </Container>
        </Hero>

        <Hero py={[15, 22]}>
          <Container>
            <H3>
              <Trans>Just arrived</Trans>{' '}
            </H3>
            <HorizontalBookList books={this.props.justArrived} mt={20} />
          </Container>
        </Hero>
        {levels.map((level, index) => (
          <Hero py={[15, 22]} key={level}>
            <Container>
              <H3>
                <Trans>Level {level}</Trans>{' '}
              </H3>
              <HorizontalBookList books={booksByLevel[index]} mt={20} />
            </Container>
          </Hero>
        ))}
      </div>
    );
  }
}

export default defaultPage(BooksPage);
