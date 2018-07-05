// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from '@lingui/react';
import styled from 'react-emotion';
import { Button, Card, CardContent, Typography } from '@material-ui/core';

import ReadingLevelTrans from '../../components/ReadingLevelTrans';
import type {
  Book,
  Language,
  FeaturedContent,
  ReadingLevel,
  Category
} from '../../types';
import Layout, { Main } from '../../components/Layout';
import { Container, View } from '../../elements';
import {
  NavContextBar,
  CategoryNavigation
} from '../../components/NavContextBar';
import Head from '../../components/Head';
import { SelectLanguage } from '../../components/LanguageMenu';
import BookList from '../../components/BookList';
import { colors, spacing } from '../../style/theme';
import media from '../../style/media';
import { flexCenter } from '../../style/flex';

type Props = {|
  featuredContent: Array<FeaturedContent>,
  newArrivals: { results: Array<Book>, language: Language },
  levels: Array<ReadingLevel>,
  booksByLevel: Array<{ results: Array<Book> }>,
  categories: Array<Category>,
  category: Category
|};

const Banner = styled('div')`
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

const HeroCovertitle = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  margin: 0;
  padding: 3px 12px;
`;

const HeroCardMobile = styled(Card)`
  ${flexCenter};
  position: relative;
  margin-top: -50px;
  margin-left: 15px;
  margin-right: 15px;
  ${media.tablet`
    display: none;
  `};
`;

const HeroCardTablet = styled(Card)`
  ${flexCenter};
  max-width: 375px;
  ${media.mobile`
    display: none;
  `};
`;

export default class HomePage extends React.Component<
  Props,
  { showLanguageMenu: boolean }
> {
  state = {
    showLanguageMenu: false
  };

  render() {
    const {
      category,
      featuredContent,
      levels,
      booksByLevel,
      newArrivals,
      categories
    } = this.props;

    const featuredForChosenCategory = featuredContent.filter(
      f => f.category && f.category.name === category
    );
    const featured =
      featuredForChosenCategory.length > 0
        ? featuredForChosenCategory[0]
        : featuredContent[0];

    const cardContent = (
      <View alignItems="center">
        <Typography
          lang={featured.language.code}
          align="center"
          variant="headline"
          component="h2"
          gutterBottom
          data-cy="card-title"
        >
          {featured.title}
        </Typography>
        <Typography
          lang={featured.language.code}
          align="center"
          paragraph
          data-cy="card-description"
        >
          {featured.description}
        </Typography>
        <Button
          href={featured.link}
          variant="raised"
          color="primary"
          size="large"
          data-cy="card-link"
        >
          <Trans>More</Trans>
        </Button>
      </View>
    );

    const languageCode = newArrivals.language.code;

    return (
      <Layout category={category} wrapWithMain={false}>
        <Head image={featured.imageUrl} />
        <NavContextBar>
          <CategoryNavigation
            category={category}
            categories={categories}
            languageCode={languageCode}
          />
          <SelectLanguage
            language={newArrivals.language}
            linkProps={language => ({
              route: 'books',
              params: { lang: language.code }
            })}
          />
        </NavContextBar>
        <Main>
          <div data-cy="featured-banner">
            <Banner src={featured.imageUrl}>
              <HeroCovertitle>
                <Typography
                  component="h1"
                  variant="title"
                  css={{ color: colors.base.white }}
                >
                  <Trans>Featured</Trans>
                </Typography>
              </HeroCovertitle>
              <HeroCardTablet>
                <CardContent>{cardContent}</CardContent>
              </HeroCardTablet>
            </Banner>
            <HeroCardMobile>
              <CardContent>{cardContent}</CardContent>
            </HeroCardMobile>
          </div>

          {levels.map((level, index) => (
            <View {...bookListViewStyle} key={level}>
              <Container width="100%" data-cy="book-list">
                <BookList
                  heading={<ReadingLevelTrans readingLevel={level} />}
                  browseLinkProps={{
                    lang: languageCode,
                    readingLevel: level,
                    category: category
                  }}
                  books={booksByLevel[index].results}
                />
              </Container>
            </View>
          ))}

          <View {...bookListViewStyle}>
            <Container width="100%" data-cy="new-arrivals">
              <BookList
                heading={<Trans>New arrivals</Trans>}
                browseLinkProps={{
                  lang: languageCode,
                  sort: '-arrivalDate',
                  category: category
                }}
                books={newArrivals.results}
              />
            </Container>
          </View>
        </Main>
      </Layout>
    );
  }
}

const bookListViewStyle = {
  py: spacing.medium,
  borderBottom: `solid 1px ${colors.base.grayLight}`
};
