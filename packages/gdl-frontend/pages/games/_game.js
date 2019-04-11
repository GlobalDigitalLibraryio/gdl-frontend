// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { Trans } from '@lingui/react';
import getConfig from 'next/config';
import styled from '@emotion/styled';
import copyToClipboard from 'copy-to-clipboard';
import gql from 'graphql-tag';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
  Typography,
  Divider as MuiDivider
} from '@material-ui/core';
import {
  Share as ShareIcon,
  Warning as WarningIcon,
  Link as LinkIcon
} from '@material-ui/icons';
import { FacebookIcon, TwitterIcon } from '../../components/icons';
import { css } from '@emotion/core';

import type { Context, ConfigShape } from '../../types';

import { logEvent } from '../../lib/analytics';
import { withErrorPage } from '../../hocs';
import Layout from '../../components/Layout';
import Main from '../../components/Layout/Main';
import Head from '../../components/Head';
import { Container, IconButton, Hidden } from '../../elements';
import CoverImage from '../../components/CoverImage';
import { spacing } from '../../style/theme';
import mq from '../../style/mq';
import media from '../../style/media';
import LevelRibbon from '../../components/Level/LevelRibbon';

const {
  publicRuntimeConfig: { zendeskUrl }
}: ConfigShape = getConfig();

const Divider = styled(MuiDivider)`
  margin: ${spacing.large} 0;
  ${media.tablet`
  margin: ${spacing.xxlarge} 0;
  `};
`;

const Grid = styled('div')(
  media.tablet`
      display: flex;
      width: calc(100% + 40px);
      margin-left: -20px;
      margin-right: -20px;
    `
);

const GridItem = styled('div')(
  media.tablet`
    flex-grow: 1;
    padding-left: 20px;
    padding-right: 20px;
   `
);

function GamePage({ game }) {
  return (
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
                  <GameLinkButton game={game} />
                </Hidden>
                <Hidden
                  only="mobile"
                  css={{ marginTop: -20, marginBottom: spacing.medium }}
                >
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
                  <div
                    css={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%'
                    }}
                  >
                    <LevelRibbon level="Games" />
                    <Actions game={game} />
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
                  <GameLinkButton game={game} />
                </Hidden>
              </GridItem>
            </Grid>
            <Hidden only="mobile" css={{ marginTop: spacing.large }}>
              <Actions game={game} isMobile />
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
}

class Actions extends React.Component<
  { game: any },
  { anchorEl: ?HTMLElement }
> {
  state = {
    anchorEl: null
  };
  handleShareClick = event => {
    /**
     * If the browser supports the web share api, we use that instead of displaying a dropdown
     */
    if (navigator.share) {
      navigator
        .share({
          title: this.props.game.title,
          text: this.props.game.description,
          url: window.location.href
        })
        .then(() => logEvent('Books', 'Shared', this.props.game.title))
        .catch(() => {}); // Ignore here because we don't care if people cancel sharing
    } else {
      this.setState({ anchorEl: event.currentTarget });
    }
  };

  closeShareMenu = () => this.setState({ anchorEl: null });

  render() {
    return (
      <div style={{ display: 'flex', width: 300, justifyContent: 'center' }}>
        <IconButton
          icon={<ShareIcon />}
          label={<Trans>Share</Trans>}
          onClick={event => this.handleShareClick(event)}
        />
        <Menu
          id="share-book-menu"
          onClose={this.closeShareMenu}
          anchorEl={this.state.anchorEl}
          open={Boolean(this.state.anchorEl)}
        >
          <MenuItem
            rel="noopener noreferrer"
            target="_blank"
            href={`https://www.facebook.com/sharer.php?u=${
              typeof window !== 'undefined' ? window.location.href : ''
            }`}
            component="a"
            onClick={this.closeShareMenu}
          >
            <ListItemIcon>
              <FacebookIcon />
            </ListItemIcon>
            <ListItemText>Facebook</ListItemText>
          </MenuItem>
          <MenuItem
            rel="noopener noreferrer"
            target="_blank"
            href={`https://twitter.com/intent/tweet?url=${
              typeof window !== 'undefined' ? window.location.href : ''
            }`}
            component="a"
            onClick={this.closeShareMenu}
          >
            <ListItemIcon>
              <TwitterIcon />
            </ListItemIcon>
            <ListItemText>Twitter</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              copyToClipboard(window.location.href);
              this.closeShareMenu();
            }}
            component="button"
          >
            <ListItemIcon>
              <LinkIcon />
            </ListItemIcon>
            <ListItemText>
              <Trans>Copy URL</Trans>
            </ListItemText>
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

const GameLinkButton = ({ game }) => (
  <Button
    rel="noopener noreferrer"
    target="_blank"
    data-cy="game-link-button"
    href={game.url}
    variant="contained"
    color="primary"
    size="large"
    fullWidth
  >
    <Trans>Go to game</Trans>
  </Button>
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

export default withErrorPage(GamePage);
