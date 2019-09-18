// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { css } from '@emotion/core';

import type { GameContent_games as Games } from '../../gqlTypes';

import ReadingLevelTrans from '../../components/ReadingLevelTrans';
import Layout from '../../components/Layout';
import Main from '../../components/Layout/Main';
import { Container, View, Hidden, SideMenuMargin } from '../../elements';
import PaginationSection from '../BookListSection/PaginationSection';
import { spacing } from '../../style/theme';
import { QueryGameList } from '../../gql';
import SideNavBar from '../../components/SideNavBar';
import MobileBottomBar from '../../components/Navbar/MobileBottomBar';

export const AMOUNT_OF_ITEMS_PER_LEVEL = 5;

type Props = {|
  games: Games,
  languageCode: string
|};

class GamePage extends React.Component<Props> {
  render() {
    const { games, languageCode } = this.props;

    return (
      <Layout wrapWithMain={false}>
        <Hidden only="desktop">
          <SideNavBar />
        </Hidden>
        <SideMenuMargin>
          <Main elevation={0} style={{ backgroundColor: 'transparent' }}>
            {games.pageInfo.pageCount > 0 && (
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
        </SideMenuMargin>
        <Hidden only="mobileAndTablet">
          <MobileBottomBar />
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
  margin-top: 20px;
`;

export default GamePage;
