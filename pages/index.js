// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from '@lingui/react';
import styled, { css } from 'react-emotion';
import {
  fetchFeaturedContent,
  fetchLevels,
  fetchLanguages,
  fetchBooks
} from '../fetch';
import type {
  Book,
  Language,
  RemoteData,
  FeaturedContent,
  Context
} from '../types';
import defaultPage from '../hocs/defaultPage';
import Layout from '../components/Layout';
import Box from '../components/Box';
import Card from '../components/Card';
import { Link } from '../routes';
import Container from '../components/Container';
import Hero from '../components/Hero';
import Head from '../components/Head';
import BookList from '../components/BookList';
import Button from '../components/Button';
import P from '../components/P';
import H3 from '../components/H3';
import H1 from '../components/H1';
import A from '../components/A';
import theme from '../style/theme';
import media from '../style/media';
import { flexCenter } from '../style/flex';
import LanguageMenu from '../components/LanguageMenu';

type Props = {
  featuredContent: RemoteData<Array<FeaturedContent>>,
  justArrived: RemoteData<{ results: Array<Book>, language: Language }>,
  levels: RemoteData<Array<string>>,
  languages: RemoteData<Array<Language>>,
  booksByLevel: Array<RemoteData<{ results: Array<Book> }>>
};

const HeroCover = styled('div')`
  background-image: ${p => (p.src ? `url(${p.src})` : 'none')};
  background-size: cover;
  position: relative;
  display: flex;
  padding: 15px;
  justify-content: center;
  ${media.mobile`
    height: 210px;
  `} ${media.tablet`
    min-height: 390px;
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

const HeroCardMobile = styled(Card)`
  ${flexCenter};
  padding: 15px;
  margin-top: -50px;
  margin-left: 15px;
  margin-right: 15px;
  ${media.tablet`
    display: none;
  `};
`;

const HeroCardTablet = styled(Card)`
  ${flexCenter};
  padding: 20px;
  max-width: 375px;
  ${media.mobile`
    display: none;
  `};
`;

const moreStyle = css`
  float: right;
  font-size: 12px;
  ${media.tablet`
    font-size: 14px;
  `};
  height: 40px;
`;

class BooksPage extends React.Component<Props, { showLanguageMenu: boolean }> {
  static async getInitialProps({ query, accessToken }: Context) {
    const language: ?string = query.lang;

    // Fetch these first, cause they don't use the reading level
    const [featuredContent, levels, languages, justArrived] = await Promise.all(
      [
        fetchFeaturedContent(language)(accessToken),
        fetchLevels(language)(accessToken),
        fetchLanguages()(accessToken),
        fetchBooks(language)(accessToken)
      ]
    );

    const booksByLevel = await Promise.all(
      levels.map(level => fetchBooks(language, { level })(accessToken))
    );

    return {
      featuredContent,
      justArrived,
      languages,
      levels,
      booksByLevel
    };
  }

  state = {
    showLanguageMenu: false
  };

  toggleShowLanguageMenu = event => {
    event.preventDefault();
    this.setState(state => ({ showLanguageMenu: !state.showLanguageMenu }));
  };

  render() {
    const {
      featuredContent,
      languages,
      levels,
      booksByLevel,
      justArrived
    } = this.props;

    const featured = featuredContent[0];
    const languageFilter = justArrived.language;

    return (
      <Layout
        language={justArrived.language}
        toolbarEnd={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              {justArrived.language.name}{' '}
              <A
                href=""
                onClick={this.toggleShowLanguageMenu}
                isUppercased
                isBold
              >
                Change
              </A>
            </div>
          </div>
        }
      >
        <Head imageUrl={featured.imageUrl} />
        <HeroCover
          pt={['15px', '40px']}
          pb={['42px', '54px']}
          src={featured.imageUrl}
        >
          <HeroCardTablet>
            <Box textAlign="center">
              <H1>{featured.title}</H1>
              <P fontSize={[14, 16]} lineHeight={[22, 26]}>
                {featured.description}
              </P>
              <Button href={featured.link}>More</Button>
            </Box>
          </HeroCardTablet>
          <HeroCovertitle>
            <Trans>Featured</Trans>
          </HeroCovertitle>
        </HeroCover>
        <HeroCardMobile>
          <Box textAlign="center">
            <H1>{featured.title}</H1>
            <P fontSize={[14, 16]} lineHeight={[22, 26]}>
              {featured.description}
            </P>
            <Button href={featured.link}>More</Button>
          </Box>
        </HeroCardMobile>

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
                  <A isUppercased className={moreStyle}>
                    <Trans>More</Trans>
                  </A>
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
        <Hero py={[15, 22]}>
          <Container>
            <H3>
              <Trans>New arrivals</Trans>{' '}
              <Link
                route="new"
                params={{ lang: justArrived.language.code }}
                passHref
              >
                <A isUppercased className={moreStyle}>
                  <Trans>More</Trans>
                </A>
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
        {this.state.showLanguageMenu && (
          <LanguageMenu
            selectedLanguage={languageFilter}
            languages={languages}
            onClose={this.toggleShowLanguageMenu}
          />
        )}
      </Layout>
    );
  }
}

export default defaultPage(BooksPage);
