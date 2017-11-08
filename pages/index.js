// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from 'lingui-react';
import type { I18n } from 'lingui-i18n';
import { MdCheck } from 'react-icons/lib/md';
import {
  fetchEditorPicks,
  fetchLevels,
  fetchLanguages,
  fetchBooks,
} from '../fetch';
import type { Book, Language, RemoteData } from '../types';
import defaultPage from '../hocs/defaultPage';
import Layout from '../components/Layout';
import Box from '../components/Box';
import Flex from '../components/Flex';
import Card from '../components/Card';
import BookCover from '../components/BookCover';
import { Link } from '../routes';
import Container from '../components/Container';
import Hero from '../components/Hero';
import Meta from '../components/Meta';
import BookList from '../components/BookList';
import P from '../components/P';
import H3 from '../components/H3';
import H4 from '../components/H4';
import More from '../components/More';
import ToolbarDropdown, {
  ToolbarDropdownItem,
} from '../components/ToolbarDropdown';

type Props = {
  editorPicks: RemoteData<Array<Book>>,
  justArrived: RemoteData<{ results: Array<Book>, language: Language }>,
  levels: RemoteData<Array<string>>,
  languages: RemoteData<Array<Language>>,
  i18n: I18n,
  booksByLevel: Array<RemoteData<{ results: Array<Book> }>>,
};

class BooksPage extends React.Component<Props> {
  static async getInitialProps({ query }) {
    const language: ?string = query.lang;

    // Fetch these first, cause they don't use the reading level
    const [editorPicks, levels, languages, justArrived] = await Promise.all([
      fetchEditorPicks(language),
      fetchLevels(language),
      fetchLanguages(),
      fetchBooks(language),
    ]);

    const booksByLevel = await Promise.all(
      levels.map(level => fetchBooks(language, { level })),
    );

    return {
      editorPicks,
      justArrived,
      languages,
      levels,
      booksByLevel,
    };
  }

  render() {
    const {
      editorPicks,
      languages,
      i18n,
      levels,
      booksByLevel,
      justArrived,
    } = this.props;

    const editorPick = editorPicks[0];
    const languageFilter = justArrived.language;

    return (
      <Layout
        toolbarEnd={
          <ToolbarDropdown
            id="langFilter"
            text={
              <Trans>
                Books in <strong>{languageFilter.name}</strong>
              </Trans>
            }
            selectedItem={languageFilter.code}
          >
            {({ getItemProps, selectedItem, highlightedIndex }) =>
              languages.map((language, index) => (
                <Link
                  key={language.code}
                  route="books"
                  passHref
                  params={{ lang: language.code }}
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
          </ToolbarDropdown>
        }
      >
        <Meta title={i18n.t`Books`} description={i18n.t`Enjoy all the books`} />

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
                      h={['148px', '255px']}
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
              <Trans>New arrivals</Trans>{' '}
              <Link
                route="new"
                params={{ lang: justArrived.language.code }}
                passHref
              >
                <More>
                  <Trans>More</Trans>
                </More>
              </Link>
            </H3>
            <BookList
              books={justArrived.results}
              mt={20}
              route={(book: Book) =>
                `/${book.language.code}/books/new/${book.id}`}
            />
          </Container>
        </Hero>
        {levels.map((level, index) => (
          <Hero py={[15, 22]} key={level}>
            <Container>
              <H3>
                <Trans>Level {level}</Trans>{' '}
                <Link
                  route="level"
                  params={{ lang: justArrived.language.code, level }}
                  passHref
                >
                  <More>
                    <Trans>More</Trans>
                  </More>
                </Link>
              </H3>
              <BookList
                books={booksByLevel[index].results}
                route={(book: Book) =>
                  `/${book.language.code}/books/level${level}/${book.id}`}
                mt={20}
              />
            </Container>
          </Hero>
        ))}
      </Layout>
    );
  }
}

export default defaultPage(BooksPage);
