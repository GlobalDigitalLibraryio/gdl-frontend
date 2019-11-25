// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { css } from '@emotion/core';
import { FormattedMessage } from 'react-intl';

import type { GameContent_games as Games } from '../../gqlTypes';

import ReadingLevelTrans from '../../components/ReadingLevelTrans';
import Layout from '../../components/Layout';
import Main from '../../components/Layout/Main';
import { Container, View, Hidden, SideMenuMargin } from '../../elements';
import PaginationSection from '../BookListSection/PaginationSection';
import { spacing } from '../../style/theme';
import { QueryGameList } from '../../gql';
import MobileBottomBar from '../../components/Navbar/MobileBottomBar';
import SideMenuBar from '../../components/Navbar/SideMenuBar';
import { Typography } from '@material-ui/core';

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
          <SideMenuBar lang={languageCode} />
        </Hidden>
        <SideMenuMargin>
          <Main elevation={0} style={{ backgroundColor: 'transparent' }}>
            <View css={scrollStyle}>
              <Container width="100%">
                {games.pageInfo.pageCount > 0 ? (
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
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 50
                    }}
                  >
                    <Typography>
                      <FormattedMessage
                        id="No games found"
                        defaultMessage="No games found"
                      />
                    </Typography>
                  </div>
                )}
              </Container>
            </View>
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
  margin-top: 20px;
`;

export default GamePage;
