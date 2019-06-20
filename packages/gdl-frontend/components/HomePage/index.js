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
  Games_games as Game,
  BooksAndFeatured,
  BooksAndFeatured_featuredContent as FeaturedContent
} from '../../gqlTypes';

import { logEvent } from '../../lib/analytics';
import ReadingLevelTrans from '../../components/ReadingLevelTrans';
import Layout from '../../components/Layout';
import Main from '../../components/Layout/Main';
import { Container, View, Hidden } from '../../elements';
import {
  NavContextBar,
  CategoryNavigation
} from '../../components/NavContextBar';
import Head from '../../components/Head';
import BooksAndShimmerView from '../BookListSection/BooksAndShimmerView';
import PaginationSection from '../BookListSection/PaginationSection';
import { colors, spacing } from '../../style/theme';
import media from '../../style/media';
import { flexCenter } from '../../style/flex';
import { QueryBookList } from '../../gql';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

import type { ReadingLevel } from '../../gqlTypes';

import Pagination from '../modules/Pagination';
import keyboardArrowRight from '../modules/keyboard_arrow_right_white.png';
import keyboardArrowLeft from '../modules/keyboard_arrow_left_white.png';

const Banner = styled('div')`
  background-image: ${p => (p.src ? `url(${p.src})` : 'none')};
  background-size: cover;
  position: relative;
  display: flex;
  padding: 15px;
  justify-content: flex;
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

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
let nrFeaturedContents;
export const AMOUNT_OF_BOOKS_PER_LEVEL = 5;

type Props = {|
  games: Array<Game>,
  bookSummaries: $Diff<
    BooksAndFeatured,
    { featuredContent: Array<FeaturedContent> }
  >,
  languageCode: string,
  featuredContent: FeaturedContent,
  categories: Array<Category>,
  category: Category
|};

type State = { index: int };

class HomePage extends React.Component<Props, State> {
  props = {};
  constructor(props) {
    super(props);
    this.state = { index: 0 };
  }

  handleNextIndex = () => {
    this.setState({
      index: this.state.index + 1
    });
  };

  handlePrevIndex = () => {
    this.setState({
      index: this.state.index - 1
    });
  };

  goToLastPage = () => {
    this.setState({
      index: nrFeaturedContents - 1
    });
  };
  goToFirstPage = () => {
    this.setState({
      index: 0
    });
  };

  render() {
    const {
      games,
      bookSummaries,
      category,
      featuredContent,
      categories,
      languageCode
    } = this.props;

    const { index } = this.state;
    //const hasPrevPage;

    const { NewArrivals, ...readingLevels } = bookSummaries;

    const cardContent = content => {
      return (
        // Specifying width here makes text in IE11 wrap
        <View alignItems="center" style={{ width: '100%' }}>
          <Typography
            lang={content.language.code}
            align="center"
            variant="h5"
            component="h2"
            gutterBottom
            // Specifying width here makes text in IE11 wrap
            style={{ width: '100%' }}
          >
            {content.title}
          </Typography>
          <Typography
            lang={content.language.code}
            align="center"
            paragraph
            // Specifying width here makes text in IE11 wrap
            style={{ width: '100%' }}
          >
            {content.description}
          </Typography>
          <Button
            onClick={() => logEvent('Navigation', 'Featured', content.title)}
            href={content.link}
            variant="contained"
            color="primary"
            size="large"
          >
            <FormattedMessage id="More" defaultMessage="More" />
          </Button>
        </View>
      );
    };

    nrFeaturedContents = featuredContent.length;

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
          <div style={{ position: 'relative' }}>
            <AutoPlaySwipeableViews
              interval={7000}
              index={index}
              onChangeIndex={index => this.setState({ index })}
            >
              {featuredContent.map(content => (
                <div>
                  <Banner src={content.imageUrl}>
                    <HeroCovertitle>
                      <Typography
                        component="h1"
                        variant="h6"
                        css={{ color: colors.base.white }}
                      >
                        <FormattedMessage
                          id="Featured"
                          defaultMessage="Featured"
                        />
                      </Typography>
                    </HeroCovertitle>
                    <HeroCardTablet>
                      {/* Specifying width here makes text in IE11 wrap*/}
                      <CardContent style={{ width: '100%' }}>
                        {cardContent(content)}
                      </CardContent>
                    </HeroCardTablet>
                  </Banner>

                  <HeroCardMobile>
                    <CardContent>{cardContent(content)}</CardContent>
                  </HeroCardMobile>
                </div>
              ))}
            </AutoPlaySwipeableViews>
            <Hidden only="desktop">
              {(index !== 0 && (
                <div
                  css={arrowLeftContainer}
                  aria-label="Previous"
                  onClick={this.handlePrevIndex}
                >
                  {' '}
                  <img
                    style={{ height: '20px', width: '20px' }}
                    src={keyboardArrowLeft}
                    alt="ArrowLeft"
                  />
                </div>
              )) ||
                (index === 0 && (
                  <div
                    css={arrowLeftContainer}
                    aria-label="Previous"
                    onClick={this.goToLastPage}
                  >
                    {' '}
                    <img
                      style={{ height: '20px', width: '20px' }}
                      src={keyboardArrowLeft}
                      alt="ArrowLeft"
                    />
                  </div>
                ))}
              {(index !== featuredContent.length - 1 && (
                <div
                  css={arrowRightContainer}
                  aria-label="Next"
                  onClick={this.handleNextIndex}
                >
                  {' '}
                  <img
                    style={{ height: '20px', width: '20px' }}
                    src={keyboardArrowRight}
                    alt="ArrowRight"
                  />
                </div>
              )) ||
                (index === featuredContent.length - 1 && (
                  <div
                    css={arrowRightContainer}
                    aria-label="Next"
                    onClick={this.goToFirstPage}
                  >
                    {' '}
                    <img
                      style={{ height: '20px', width: '20px' }}
                      src={keyboardArrowRight}
                      alt="ArrowRight"
                    />
                  </div>
                ))}
              <div css={dotsContainer}>
                <Pagination
                  dots={featuredContent.length}
                  index={index}
                  onChangeIndex={index => this.setState({ index })}
                />
              </div>
            </Hidden>
            <Hidden only="mobileAndTablet">
              <div style={{ paddingTop: '8px' }}>
                <Pagination
                  dots={featuredContent.length}
                  index={index}
                  onChangeIndex={index => this.setState({ index })}
                />
              </div>
            </Hidden>{' '}
          </div>
          <View css={scrollStyle}>
            <Container width="100%">
              <QueryBookList
                category={category}
                pageSize={AMOUNT_OF_BOOKS_PER_LEVEL}
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
                    heading={
                      <FormattedMessage
                        id="New arrivals"
                        defaultMessage="New arrivals"
                      />
                    }
                    browseLinkProps={{
                      lang: languageCode,
                      category: category
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
                    pageSize={AMOUNT_OF_BOOKS_PER_LEVEL}
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
                        heading={<ReadingLevelTrans readingLevel={level} />}
                        browseLinkProps={{
                          lang: languageCode,
                          readingLevel: level,
                          category: category
                        }}
                        items={books.results}
                      />
                    )}
                  </QueryBookList>
                </Container>
              </View>
            ))}

          {category === 'Library' && (
            <View css={scrollStyle}>
              <Container width="100%">
                <BooksAndShimmerView
                  items={games}
                  shouldBeColorized
                  level="Games"
                  heading={<ReadingLevelTrans readingLevel="Games" />}
                />
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
const arrowRightContainer = css`
  position: absolute;
  width: 9.9%;
  height: 100%;
  top: 0;
  right: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row-reverse;
  &:hover {
    transition: all 0.2s ease-in;
    background: rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }
`;
const arrowLeftContainer = css`
  position: absolute;
  width: 9.9%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  &:hover {
    transition: all 0.2s ease-in;
    background: rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }
`;
const dotsContainer = css`
  position: relative;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justifycontent: center;
`;

export default HomePage;
