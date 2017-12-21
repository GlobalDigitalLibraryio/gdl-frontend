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
import Box from '../components/Box';
import Card from '../components/Card';
import { Link } from '../routes';
import Container from '../components/Container';
import Hero from '../components/Hero';
import Meta from '../components/Meta';
import BookList from '../components/BookList';
import ButtonLink from '../components/ButtonLink';
import P from '../components/P';
import H3 from '../components/H3';
import H1 from '../components/H1';
import More from '../components/More';
import ToolbarDropdown, {
  ToolbarDropdownItem,
} from '../components/ToolbarDropdown';
import theme from '../style/theme';
import media from '../style/media';
import { flexCenter } from '../style/flex';

type Props = {
  editorPicks: RemoteData<Array<Book>>,
  justArrived: RemoteData<{ results: Array<Book>, language: Language }>,
  levels: RemoteData<Array<string>>,
  languages: RemoteData<Array<Language>>,
  i18n: I18n,
  booksByLevel: Array<RemoteData<{ results: Array<Book> }>>,
};

const HeroCover = styled('div')`
  background-image: ${p => (p.src ? `url(${p.src})` : 'none')};
  background-size: cover;
  position: relative;
  display: flex;
  height: 210px;
  padding: 15px;
  justify-content: center;
  ${media.tablet`
    height: 390px;
    padding: 20px;
    justify-content: flex-end;
  `};
`;

const HeroCovertitle = styled('h3')`
  position: absolute;
  top: 0;
  left: 0;
  color: ${theme.colors.white};
  background: rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
  margin: 0;
  padding: 5px 15px;
  font-weight: 500;
  font-size: 14px;
  ${media.tablet`
    font-size: 18px;
  `};
`;

const CARD_OFFSET = '160px';
const HeroCard = styled(Card)`
  ${flexCenter};
  height: 100%;
  flex: 1;
  ${media.tablet`
    max-width: 375px;
  `};
  ${media.mobile`
    margin-top: ${CARD_OFFSET};
  `};
`;

class BooksPage extends React.Component<Props> {
  static async getInitialProps({ query, accessToken }) {
    const language: ?string = query.lang;

    // Fetch these first, cause they don't use the reading level
    const [editorPicks, levels, languages, justArrived] = await Promise.all([
      fetchEditorPicks(language)(accessToken),
      fetchLevels(language)(accessToken),
      fetchLanguages()(accessToken),
      fetchBooks(language)(accessToken),
    ]);

    const booksByLevel = await Promise.all(
      levels.map(level => fetchBooks(language, { level })(accessToken)),
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
          src={editorPick.coverPhoto && editorPick.coverPhoto.large}
        >
          <HeroCard p={[15, 20]}>
            <Box textAlign="center">
              <H1>{editorPick.title}</H1>
              <P fontSize={[14, 16]} lineHeight={[22, 26]}>
                {editorPick.description}
              </P>
              <Link
                route="book"
                params={{ id: editorPick.id, lang: editorPick.language.code }}
                passHref
              >
                <ButtonLink>Read book</ButtonLink>
              </Link>
            </Box>
          </HeroCard>
          <HeroCovertitle>
            <Trans>Featured book</Trans>
          </HeroCovertitle>
        </HeroCover>

        <Hero py={[15, 22]} mt={[CARD_OFFSET, 0]}>
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
