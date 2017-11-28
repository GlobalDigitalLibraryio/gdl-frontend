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
import styled from 'styled-components';
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
import Flex from '../components/Flex';
import Card from '../components/Card';
import { Link } from '../routes';
import Container from '../components/Container';
import Hero from '../components/Hero';
import Meta from '../components/Meta';
import BookList from '../components/BookList';
import ButtonLink from '../components/ButtonLink';
import P from '../components/P';
import H3 from '../components/H3';
import H4 from '../components/H4';
import More from '../components/More';
import ToolbarDropdown, {
  ToolbarDropdownItem,
} from '../components/ToolbarDropdown';
import theme from '../style/theme';
import media from '../style/media';

type Props = {
  editorPicks: RemoteData<Array<Book>>,
  justArrived: RemoteData<{ results: Array<Book>, language: Language }>,
  levels: RemoteData<Array<string>>,
  languages: RemoteData<Array<Language>>,
  i18n: I18n,
  booksByLevel: Array<RemoteData<{ results: Array<Book> }>>,
};

const HeroCover = styled('div')`
  background-image: url(${p => p.src});
  background-size: cover;
  ${media.tablet`
    height: 390px;
  `} height: 210px;
  position: relative;
`;

const HeroCovertitle = styled('h3')`
  position: absolute;
  top: 0;
  left: 0;
  color: ${theme.colors.white};
  background: rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
  margin: 0;
  padding: 5px;
`;

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
        language={justArrived.language}
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
              ))
            }
          </ToolbarDropdown>
        }
      >
        <Meta title={i18n.t`Books`} description={i18n.t`Enjoy all the books`} />

        <HeroCover
          pt={['15px', '40px']}
          pb={['42px', '54px']}
          src={editorPick.coverPhoto.large}
        >
          <HeroCovertitle>
            <Trans>Featured book</Trans>
          </HeroCovertitle>
          <Card
            p={['15px', '20px']}
            w={375}
            style={{
              top: '20px',
              right: '20px',
              position: 'absolute',
              height: '350px',
            }}
          >
            <Flex align="center" justify="center" column textAlign="center">
              <H4>{editorPick.title}</H4>
              <P fontSize={[12, 16]} lineHeight={[18, 24]}>
                {editorPick.description}
              </P>
              <Link
                route="book"
                params={{ id: editorPick.id, lang: editorPick.language.code }}
                passHref
              >
                <ButtonLink>Go to book</ButtonLink>
              </Link>
            </Flex>
          </Card>
        </HeroCover>

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
                `/${book.language.code}/books/new/${book.id}`
              }
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
                  `/${book.language.code}/books/level${level}/${book.id}`
                }
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
