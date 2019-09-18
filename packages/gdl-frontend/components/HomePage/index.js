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
import { Container, View, Hidden, SideMenuMargin } from '../../elements';
import {
  NavContextBar,
  CategoryNavigation
} from '../../components/NavContextBar';
import Head from '../../components/Head';
import PaginationSection from '../BookListSection/PaginationSection';
import { colors, spacing, misc } from '../../style/theme';
import media from '../../style/media';
import { flexCenter } from '../../style/flex';
import { QueryBookList } from '../../gql';
import MobileBottomBar from '../../components/Navbar/MobileBottomBar';
import SideMenuBar from '../../components/Navbar/SideMenuBar';

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
  ${media.largerTablet`
    max-width: ${misc.containers.small}px;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
  `}
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
    return (
      this.props.languageCode !== nextProps.languageCode ||
      this.props.category !== nextProps.category
    );
  }
  render() {
    const {
      homeContent,
      category,
      featuredContent,
      categories,
      languageCode
    } = this.props;

    // Destructuring Games, otherwise apollo can't seperate it
    const { Games, ...readingLevels } = homeContent;

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
        <Hidden only="desktop">
          <SideMenuBar lang={languageCode} />
        </Hidden>
        <SideMenuMargin>
          <Main elevation={0} style={{ backgroundColor: 'transparent' }}>
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
                <CardContent style={{ width: '100%' }}>
                  {cardContent}
                </CardContent>
              </HeroCardTablet>
            </Banner>
            <HeroCardMobile>
              <CardContent>{cardContent}</CardContent>
            </HeroCardMobile>

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
          </Main>
        </SideMenuMargin>
        <Hidden only="mobileAndTablet">
          <MobileBottomBar lang={languageCode} />
        </Hidden>
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
`;

export default HomePage;
