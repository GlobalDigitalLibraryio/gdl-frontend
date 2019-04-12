// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { Trans } from '@lingui/react';
import getConfig from 'next/config';
import gql from 'graphql-tag';
import { Button, Typography } from '@material-ui/core';
import { Warning as WarningIcon } from '@material-ui/icons';
import { css } from '@emotion/core';

import { withErrorPage } from '../../hocs';
import Layout from '../../components/Layout';
import Main from '../../components/Layout/Main';
import Head from '../../components/Head';
import { Container, Hidden } from '../../elements';
import CoverImage from '../../components/CoverImage';
import { spacing } from '../../style/theme';
import mq from '../../style/mq';
import media from '../../style/media';
import LevelRibbon from '../../components/Level/LevelRibbon';
import { logEvent } from '../../lib/analytics';
import {
  Grid,
  GridItem,
  Divider,
  ShareButton
} from '../../components/DetailsPage';

import type { Context, ConfigShape } from '../../types';

const {
  publicRuntimeConfig: { zendeskUrl }
}: ConfigShape = getConfig();

const GamePage = ({ game }) => (
  <>
    <Head
      description={game.description}
      title={game.title}
      image={game.coverImage && game.coverImage.url}
    />
    <Layout wrapWithMain={false}>
      <Main background="white" css={mq({ marginTop: [200, 100, 100] })}>
        <Container css={mq({ marginTop: [-160, -54, -54] })}>
          <Grid>
            <GridItem css={media.tablet`flex: 0 0 310px;`}>
              <CoverImage
                css={{ marginLeft: 'auto' }}
                coverImage={game.coverImage}
                size="large"
              />
              <Hidden only="tablet" css={{ marginTop: spacing.xxlarge }}>
                <GameLinkButton title={game.title} url={game.url} />
              </Hidden>
              <Hidden only="mobile" css={styles.mobileRibbon}>
                <LevelRibbon level="Games" />
              </Hidden>
            </GridItem>

            <GridItem>
              <Hidden
                only="tablet"
                css={{
                  marginTop: 120,
                  marginBottom: 45
                }}
              >
                <div css={styles.actionRow}>
                  <LevelRibbon level="Games" />
                  <div css={styles.actions}>
                    <ShareButton
                      title={game.title}
                      description={game.description}
                      logEvent="Games"
                    />
                  </div>
                </div>
              </Hidden>
              <Typography lang={game.language} variant="h5" component="h1">
                {game.title}
              </Typography>
              <Typography paragraph variant="subtitle1">
                <Trans>from {game.publisher}</Trans>
              </Typography>
              <Typography lang={game.language} paragraph>
                {game.description}
              </Typography>
              <Hidden only="mobile">
                <GameLinkButton title={game.title} url={game.url} />
              </Hidden>
            </GridItem>
          </Grid>

          <Hidden only="mobile" css={{ marginTop: spacing.large }}>
            <div css={styles.actions}>
              <ShareButton
                title={game.title}
                description={game.description}
                logEvent="Games"
              />
            </div>
          </Hidden>

          <Divider />

          <Grid>
            <GridItem>
              <Typography variant="subtitle2" component="span">
                <Trans>License</Trans>
              </Typography>
              <Typography
                component="span"
                paragraph
                css={css`
                  margin-bottom: 0;
                `}
              >
                {game.license}
              </Typography>
            </GridItem>
            <Hidden only="mobile">
              <GridItem>
                <Divider />
              </GridItem>
            </Hidden>
            <GridItem css={media.tablet`flex: 0 0 310px; order: -1`}>
              <Button
                data-cy="report-game-button"
                color="primary"
                href={zendeskUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginBottom: 20 }}
              >
                <WarningIcon css={{ marginRight: spacing.xsmall }} />{' '}
                <Trans>Report a problem</Trans>
              </Button>
            </GridItem>
          </Grid>
        </Container>
      </Main>
    </Layout>
  </>
);

GamePage.getInitialProps = async ({ query, req, apolloClient }: Context) => {
  const gameRes = await apolloClient.query({
    query: GAME_QUERY,
    variables: { id: query.id }
  });

  if (!gameRes.data.game) {
    return {
      statusCode: 404
    };
  }

  return {
    game: gameRes.data.game
  };
};

const GameLinkButton = ({ title, url }: { title: string, url: string }) => (
  <Button
    rel="noopener noreferrer"
    target="_blank"
    data-cy="game-link-button"
    href={url}
    variant="contained"
    color="primary"
    size="large"
    fullWidth
    onClick={() => logEvent('Games', 'Play', title)}
  >
    <Trans>Go to game</Trans>
  </Button>
);

const GAME_QUERY = gql`
  query game($id: ID!) {
    game(id: $id) {
      id
      title
      description
      url
      source
      publisher
      license
      language
      coverImage {
        imageId
        url
        altText
      }
    }
  }
`;

const styles = {
  actionRow: css`
    display: flex;
    align-items: center;
    width: 100%;
  `,
  actions: css`
    display: flex;
    justify-content: center;
    width: 300px;
  `,
  mobileRibbon: css`
    margin-top: -20px;
    margin-bottom: ${spacing.medium};
  `
};

export default withErrorPage(GamePage);
