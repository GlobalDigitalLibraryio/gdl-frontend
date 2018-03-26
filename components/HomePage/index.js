// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from '@lingui/react';
import styled, { css } from 'react-emotion';

import ReadingLevelTrans from '../../components/ReadingLevelTrans';
import BrowseLink from '../../components/BrowseLink';
import type {
  Book,
  Language,
  FeaturedContent,
  ReadingLevel,
  Category
} from '../../types';
import Layout from '../../components/Layout';
import Box from '../../components/Box';
import Card from '../../components/Card';
import Container from '../../components/Container';
import Hero from '../../components/Hero';
import Head from '../../components/Head';
import BookList from '../../components/BookList';
import Button from '../../components/Button';
import P from '../../components/P';
import H1 from '../../components/H1';
import A from '../../components/A';
import theme from '../../style/theme';
import media from '../../style/media';
import { flexCenter } from '../../style/flex';

type Props = {|
  featuredContent: Array<FeaturedContent>,
  newArrivals: { results: Array<Book>, language: Language },
  levels: Array<ReadingLevel>,
  languages: Array<Language>,
  booksByLevel: Array<{ results: Array<Book> }>,
  categories: Array<Category>,
  category: Category
|};

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

const HeroCovertitle = styled('h1')`
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

const FeaturedTitle = H1.withComponent('h2');

export default class HomePage extends React.Component<Props> {
  render() {
    const {
      category,
      featuredContent,
      languages,
      levels,
      booksByLevel,
      newArrivals,
      categories
    } = this.props;

    const featured = featuredContent[0];

    return (
      <Layout languages={languages} categories={categories}>
        <Head imageUrl={featured.imageUrl} />
        <HeroCover
          pt={['15px', '40px']}
          pb={['42px', '54px']}
          src={featured.imageUrl}
        >
          <HeroCovertitle>
            <Trans>Featured</Trans>
          </HeroCovertitle>
          <HeroCardTablet>
            <Box textAlign="center">
              <FeaturedTitle lang={featured.language.code}>
                {featured.title}
              </FeaturedTitle>
              <P
                fontSize={[14, 16]}
                lineHeight={[22, 26]}
                lang={featured.language.code}
              >
                {featured.description}
              </P>
              <Button href={featured.link}>More</Button>
            </Box>
          </HeroCardTablet>
        </HeroCover>
        <HeroCardMobile>
          <Box textAlign="center">
            <FeaturedTitle lang={featured.language.code}>
              {featured.title}
            </FeaturedTitle>
            <P
              fontSize={[14, 16]}
              lineHeight={[22, 26]}
              lang={featured.language.code}
            >
              {featured.description}
            </P>
            <Button href={featured.link}>More</Button>
          </Box>
        </HeroCardMobile>

        {levels.map((level, index) => (
          <Hero py={[15, 22]} key={level}>
            <Container>
              <BrowseLink
                lang={newArrivals.language.code}
                readingLevel={level}
                category={category}
              >
                <A isUppercased className={moreStyle}>
                  <Trans>More</Trans>
                </A>
              </BrowseLink>
              <BookList
                books={booksByLevel[index].results}
                heading={<ReadingLevelTrans readingLevel={level} />}
                mt={20}
              />
            </Container>
          </Hero>
        ))}
        <Hero py={[15, 22]}>
          <Container>
            <BrowseLink
              lang={newArrivals.language.code}
              sort="-arrivalDate"
              category={category}
            >
              <A isUppercased className={moreStyle}>
                <Trans>More</Trans>
              </A>
            </BrowseLink>
            <BookList
              heading={<Trans>New arrivals</Trans>}
              books={newArrivals.results}
              mt={20}
            />
          </Container>
        </Hero>
      </Layout>
    );
  }
}
