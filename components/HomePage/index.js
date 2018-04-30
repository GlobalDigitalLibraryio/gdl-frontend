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

import ReadingLevelTrans from '../../components/ReadingLevelTrans';
import type {
  Book,
  Language,
  FeaturedContent,
  ReadingLevel,
  Category
} from '../../types';
import Layout, { Main } from '../../components/Layout';
import Card from '../../components/Card';
import { Container, Text, View } from '../../elements';
import {
  NavContextBar,
  CategoryNavigation
} from '../../components/NavContextBar';
import Head from '../../components/Head';
import { SelectLanguage } from '../../components/LanguageMenu';
import BookList from '../../components/BookList';
import Button from '../../components/Button';
import { colors, fonts, spacing } from '../../style/theme';
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
  padding: ${spacing.small};
  margin-top: -50px;
  margin-left: 15px;
  margin-right: 15px;
  ${media.tablet`
    display: none;
  `};
`;

const HeroCardTablet = styled(Card)`
  ${flexCenter};
  padding: ${spacing.medium};
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
        <Text
          accessibilityRole="heading"
          aria-level="2"
          lang={featured.language.code}
          fontSize={['1.7rem', '2.1rem']}
          fontWeight={fonts.weight.medium}
          textAlign="center"
        >
          {featured.title}
        </Text>
        <View my={spacing.small}>
          <Text lang={featured.language.code} textAlign="center">
            {featured.description}
          </Text>
        </View>
        <Button href={featured.link}>
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
          <Banner src={featured.imageUrl}>
            <HeroCovertitle>
              <Text
                accessibilityRole="heading"
                color={colors.base.white}
                fontSize="1.1rem"
                fontWeight={fonts.weight.medium}
              >
                <Trans>Featured</Trans>
              </Text>
            </HeroCovertitle>
            <HeroCardTablet>{cardContent}</HeroCardTablet>
          </Banner>
          <HeroCardMobile>{cardContent}</HeroCardMobile>

          {levels.map((level, index) => (
            <View {...bookListViewStyle} key={level}>
              <Container width="100%">
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
            <Container width="100%">
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
