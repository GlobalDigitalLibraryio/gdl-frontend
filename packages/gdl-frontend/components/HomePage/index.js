// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { css } from '@emotion/core';
import { FormattedMessage } from 'react-intl';
import styled from '@emotion/styled';
import { Button, Card, CardContent, Typography } from '@material-ui/core';

import type {
  Category,
  HomeContent,
  HomeContent_featuredContent as FeaturedContent
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
import PaginationSection from '../BookListSection/PaginationSection';
import { colors, spacing } from '../../style/theme';
import media from '../../style/media';
import { flexCenter } from '../../style/flex';
import { QueryBookList, QueryGameList } from '../../gql';

import type { ReadingLevel } from '../../gqlTypes';

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

export const AMOUNT_OF_ITEMS_PER_LEVEL = 5;

type Props = {|
  homeContent: HomeContent,
  languageCode: string,
  featuredContent: FeaturedContent,
  categories: Array<Category>,
  category: Category
|};

class HomePage extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return this.props.languageCode !== nextProps.languageCode;
  }
  render() {
    const {
      homeContent,
      category,
      featuredContent,
      categories,
      languageCode
    } = this.props;

    // Destructuring NewArrivals and Games, otherwise apollo can't seperate it
    const { NewArrivals, Games, ...readingLevels } = homeContent;

    const cardContent = (
      // Specifying width here makes text in IE11 wrap
      <View alignItems="center" style={{ width: '100%' }}>
        <Typography
          lang={featuredContent.language.code}
          align="center"
          variant="h5"
          component="h2"
          gutterBottom
          // Specifying width here makes text in IE11 wrap
          style={{ width: '100%' }}
        >
          {featuredContent.title}
        </Typography>
        <Typography
          lang={featuredContent.language.code}
          align="center"
          paragraph
          // Specifying width here makes text in IE11 wrap
          style={{ width: '100%' }}
        >
          {featuredContent.description}
        </Typography>
        <Button
          onClick={() =>
            logEvent('Navigation', 'Featured', featuredContent.title)
          }
          href={featuredContent.link}
          variant="contained"
          color="primary"
          size="large"
        >
          <FormattedMessage id="More" defaultMessage="More" />
        </Button>
      </View>
    );

    return (
      <Layout wrapWithMain={false}>
        <Head image={featuredContent.imageUrl} />
        <NavContextBar>
          <CategoryNavigation
            category={category}
            categories={categories}
            languageCode={languageCode}
          />
        </NavContextBar>
        <Main>
          <Banner src={featuredContent.imageUrl}>
            <HeroCovertitle>
              <Typography
                component="h1"
                variant="h6"
                css={{ color: colors.base.white }}
              >
                <FormattedMessage id="Featured" defaultMessage="Featured" />
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

          <View css={scrollStyle}>
            <Container width="100%">
              <QueryBookList
                category={category}
                pageSize={AMOUNT_OF_ITEMS_PER_LEVEL}
                language={languageCode}
                orderBy="arrivalDate_DESC"
              >
                {({ books, loadMore, goBack, loading }) => (
                  <PaginationSection
                    loading={loading}
                    loadMore={loadMore}
                    goBack={goBack}
                    pageInfo={books.pageInfo}
                    shouldBeColorized
                    languageCode={languageCode}
                    heading={
                      <FormattedMessage
                        id="New arrivals"
                        defaultMessage="New arrivals"
                      />
                    }
                    browseLinkProps={{
                      lang: languageCode,
                      category: category,
                      route: 'browseBooks'
                    }}
                    items={books.results}
                  />
                )}
              </QueryBookList>
            </Container>
          </View>

          {Object.entries(readingLevels)
            // $FlowFixMe TODO: Get this properly typed. Maybe newer Flow versions understands this instead of turning into a mixed type
            .filter(
              ([_, data]: [ReadingLevel, any]) =>
                data.results && data.results.length > 0
            )
            .map(([level, data]: [ReadingLevel, any]) => (
              <View css={scrollStyle} key={level}>
                <Container width="100%">
                  <QueryBookList
                    category={category}
                    readingLevel={level}
                    pageSize={AMOUNT_OF_ITEMS_PER_LEVEL}
                    language={languageCode}
                    orderBy="title_ASC"
                  >
                    {({ books, loadMore, goBack, loading }) => (
                      <PaginationSection
                        loading={loading}
                        loadMore={loadMore}
                        goBack={goBack}
                        pageInfo={books.pageInfo}
                        shouldBeColorized
                        level={level}
                        languageCode={languageCode}
                        heading={<ReadingLevelTrans readingLevel={level} />}
                        browseLinkProps={{
                          lang: languageCode,
                          readingLevel: level,
                          category: category,
                          route: 'browseBooks'
                        }}
                        items={books.results}
                      />
                    )}
                  </QueryBookList>
                </Container>
              </View>
            ))}

          {Games.pageInfo.pageCount > 0 && (
            <View css={scrollStyle}>
              <Container width="100%">
                <QueryGameList
                  language={languageCode}
                  pageSize={AMOUNT_OF_ITEMS_PER_LEVEL}
                >
                  {({ games, loadMore, goBack, loading }) => (
                    <PaginationSection
                      loading={loading}
                      loadMore={loadMore}
                      goBack={goBack}
                      pageInfo={games.pageInfo}
                      shouldBeColorized
                      languageCode={languageCode}
                      level="Games"
                      browseLinkProps={{
                        lang: languageCode,
                        route: 'browseGames'
                      }}
                      heading={<ReadingLevelTrans readingLevel="Games" />}
                      items={games.results}
                    />
                  )}
                </QueryGameList>
              </Container>
            </View>
          )}
        </Main>
      </Layout>
    );
  }
}

const scrollStyle = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${spacing.medium} 0;
  border-bottom: solid 1px ${colors.base.grayLight};
`;

export default HomePage;
