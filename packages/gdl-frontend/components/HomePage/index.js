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

import type { Category } from '../../types';
import type {
  books as Books,
  FeaturedContent_featuredContent as FeaturedContent
} from '../../gqlTypes';

import { logEvent } from '../../lib/analytics';
import ReadingLevelTrans from '../../components/ReadingLevelTrans';
import Layout from '../../components/Layout';
import Main from '../../components/Layout/Main';
import { Container, View } from '../../elements';
import {
  NavContextBar,
  CategoryNavigation
} from '../../components/NavContextBar';
import Head from '../../components/Head';
import BookList from '../../components/BookList';
import { colors, spacing } from '../../style/theme';
import media from '../../style/media';
import { flexCenter } from '../../style/flex';

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
  margin-left: ${spacing.large};
  margin-right: ${spacing.large};
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

type Props = {|
  bookSummaries: Books,
  languageCode: string,
  featuredContent: Array<FeaturedContent>,
  categories: Array<Category>,
  category: Category
|};

export default class HomePage extends React.Component<Props> {
  render() {
    const {
      bookSummaries,
      category,
      featuredContent,
      categories,
      languageCode
    } = this.props;

    const featuredForChosenCategory = featuredContent.filter(
      // $FlowFixMe...
      f => f.category && f.category.name === category
    );
    const featured =
      featuredForChosenCategory.length > 0
        ? featuredForChosenCategory[0]
        : featuredContent[0];

    const { NewArrivals, ...readingLevels } = bookSummaries;

    const cardContent = (
      // Specifying width here makes text in IE11 wrap
      <View alignItems="center" style={{ width: '100%' }}>
        <Typography
          lang={featured.language.code}
          align="center"
          variant="h5"
          component="h2"
          gutterBottom
          // Specifying width here makes text in IE11 wrap
          style={{ width: '100%' }}
        >
          {featured.title}
        </Typography>
        <Typography
          lang={featured.language.code}
          align="center"
          paragraph
          // Specifying width here makes text in IE11 wrap
          style={{ width: '100%' }}
        >
          {featured.description}
        </Typography>
        <Button
          onClick={() => logEvent('Navigation', 'Featured', featured.title)}
          href={featured.link}
          variant="contained"
          color="primary"
          size="large"
        >
          <Trans>More</Trans>
        </Button>
      </View>
    );

    return (
      <Layout wrapWithMain={false}>
        <Head image={featured.imageUrl} />
        <NavContextBar>
          <CategoryNavigation
            category={category}
            categories={categories}
            languageCode={languageCode}
          />
        </NavContextBar>
        <Main>
          <Banner src={featured.imageUrl}>
            <HeroCovertitle>
              <Typography
                component="h1"
                variant="h6"
                css={{ color: colors.base.white }}
              >
                <Trans>Featured</Trans>
              </Typography>
            </HeroCovertitle>
            <HeroCardTablet>
              {/* Specifying width here makes text in IE11 wrap*/}
              <CardContent style={{ width: '100%' }}>{cardContent}</CardContent>
            </HeroCardTablet>
          </Banner>
          <HeroCardMobile>
            <CardContent>{cardContent}</CardContent>
          </HeroCardMobile>

          <View {...bookListViewStyle}>
            <Container width="100%">
              <BookList
                heading={<Trans>New arrivals</Trans>}
                browseLinkProps={{
                  lang: languageCode,
                  category: category
                }}
                books={NewArrivals.results}
              />
            </Container>
          </View>

          {Object.entries(readingLevels)
            // $FlowFixMe TODO: Get this properly typed. Maybe newer Flow versions understands this instead of turning into a mixed type
            .filter(([_, data]) => data.results && data.results.length > 0)
            .map(([level, data]) => (
              <View {...bookListViewStyle} key={level}>
                <Container width="100%">
                  <BookList
                    heading={<ReadingLevelTrans readingLevel={level} />}
                    browseLinkProps={{
                      lang: languageCode,
                      readingLevel: level,
                      category: category
                    }}
                    books={bookSummaries[level].results}
                  />
                </Container>
              </View>
            ))}
        </Main>
      </Layout>
    );
  }
}

const bookListViewStyle = {
  py: spacing.medium,
  borderBottom: `solid 1px ${colors.base.grayLight}`
};
