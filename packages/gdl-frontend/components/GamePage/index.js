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

import type { GameList_games as Games } from '../../gqlTypes';

import Layout from '../../components/Layout';
import Main from '../../components/Layout/Main';
import {
  Container,
  View,
  Hidden,
  SideMenuMargin,
  LoadingButton
} from '../../elements';
import { spacing } from '../../style/theme';
import MobileBottomBar from '../../components/Navbar/MobileBottomBar';
import SideMenuBar from '../../components/Navbar/SideMenuBar';
import { Typography } from '@material-ui/core';
import GridContainer from '../BookGrid/styledGridContainer';
import LevelHR from '../Level/LevelHR';
import GameLink from '../BookListSection/GameLink';

type Props = {|
  games: Games,
  languageCode: string,
  languageName: string,
  loading: boolean,
  loadMore: () => void,

  showGameButton?: boolean,
  showBookButton?: boolean
|};

const GamePage = ({
  games: { pageInfo, results },
  loading,
  loadMore,
  languageCode,
  languageName,
  showBookButton,
  showGameButton
}: Props) => (
  <Layout wrapWithMain={false}>
    <Hidden only="desktop">
      <SideMenuBar
        showGameButton={showGameButton}
        showBookButton={showBookButton}
        lang={languageCode}
      />
    </Hidden>
    <SideMenuMargin>
      <Main elevation={0} style={{ backgroundColor: 'transparent' }}>
        <View css={scrollStyle}>
          <Container width="100%">
            <GridContainer>
              <Typography
                variant="h4"
                component="h1"
                align="left"
                css={{
                  margin: `${spacing.large} 0`,
                  width: 'auto',
                  gridColumn: '1/-1'
                }}
              >
                {results.length > 0 ? (
                  <>
                    {/* $FlowFixMe This is the level from the query parameter. Which doesn't really typecheck */}
                    {languageName}
                    <LevelHR
                      level="Games"
                      css={{
                        margin: `${spacing.xsmall} 0`
                      }}
                    />
                  </>
                ) : (
                  <FormattedMessage
                    id="No games found"
                    defaultMessage="No games found"
                  />
                )}
              </Typography>
            </GridContainer>
            <GridContainer>
              {results.map(game => (
                <GameLink key={game.id} game={game} />
              ))}
            </GridContainer>
            <div css={{ alignSelf: 'center' }}>
              <LoadingButton
                disabled={!pageInfo.hasNextPage}
                onClick={loadMore}
                isLoading={loading}
                color="primary"
                variant="outlined"
                css={{
                  marginTop: spacing.xlarge,
                  marginBottom: spacing.medium
                }}
              >
                <FormattedMessage id="More games" defaultMessage="More games" />
              </LoadingButton>
            </div>
          </Container>
        </View>
      </Main>
    </SideMenuMargin>
    <Hidden only="mobileAndTablet">
      <MobileBottomBar lang={languageCode} />
    </Hidden>
  </Layout>
);

const scrollStyle = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${spacing.medium} 0;
  margin-top: 20px;
`;

export default GamePage;
