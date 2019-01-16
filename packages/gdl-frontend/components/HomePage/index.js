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

import { logEvent } from '../../lib/analytics';
import type {
  Book,
  Language,
  FeaturedContent,
  ReadingLevel,
  Category
} from '../../types';
import Layout from '../../components/Layout';
import Main from '../../components/Layout/Main';
import { Container, View } from '../../elements';
import {
  NavContextBar,
  CategoryNavigation
} from '../../components/NavContextBar';
import Head from '../../components/Head';
import BookList from '../../components/BookList';
import ReadingLevelTrans from '../ReadingLevelTrans';
import { colors, spacing } from '../../style/theme';
import media from '../../style/media';
import { flexCenter } from '../../style/flex';
import Tutorial from './Tutorial';
import { withTutorialContext } from '../../context/TutorialContext';

type Props = {|
  context: {
    homePageStatus: boolean,
    onFinishHomeTutorial: () => void,
    resetTutorialStatus: () => void
  },
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

class HomePage extends React.Component<Props, { showLanguageMenu: boolean }> {
  state = {
    showLanguageMenu: false
  };

  componentDidMount() {
    this.props.context.resetTutorialStatus();
  }

  render() {
    const {
      context,
      category,
      featuredContent,
      levels,
      booksByLevel,
      newArrivals,
      categories
    } = this.props;

    const featuredForChosenCategory = featuredContent.filter(
      // $FlowFixMe...
      f => f.category && f.category.name === category
    );
    const featured =
      featuredForChosenCategory.length > 0
        ? featuredForChosenCategory[0]
        : featuredContent[0];

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

    const languageCode = newArrivals.language.code;

    return (
      <Layout
        wrapWithMain={false}
        // TODO: when emotion 10 is merged, instead of toggling appbar position when can disable scrolling with <Global />
        homeTutorialInProgress={!context.homePageStatus}
      >
        <Tutorial
          status={!context.homePageStatus}
          onFinish={context.onFinishHomeTutorial}
        />
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
                  sort: '-arrivalDate',
                  category: category
                }}
                books={newArrivals.results}
                shouldBeColorized
              />
            </Container>
          </View>

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
                  level={level}
                  shouldBeColorized
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

export default withTutorialContext(HomePage);
