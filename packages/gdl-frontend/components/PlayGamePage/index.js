// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Card } from '@material-ui/core';
import { Global, css } from '@emotion/core';
import styled from '@emotion/styled';
import Toolbar from './Toolbar';
import { Container } from '../../elements';
import { Backdrop } from '../../components/Reader/styledReader';

import type { game_game as Game } from '../../gqlTypes';

type Props = {
  game: Game,
  onClose: () => void
};

/**
 * This page is customized to work with H5P embedded games
 */
const PlayGamePage = ({ game, onClose }: Props) => (
  <Container size="large" gutter={false}>
    {/* Disable scrolling and only allow it in the iframe */}
    <Global
      styles={css`
        body {
          overflow: hidden;
        }
      `}
    />
    <Backdrop />
    <Card>
      <Toolbar title={game.title} onClose={onClose} />
      <ResponsiveIframeContainer>
        <ResponsiveIframe
          title={game.title}
          src={`${game.url}/embed`}
          frameBorder="0"
          allow="encrypted-media"
        />
        <script src="https://gdl.h5p.com/js/h5p-resizer.js" charSet="UTF-8" />
      </ResponsiveIframeContainer>
    </Card>
  </Container>
);

export default PlayGamePage;

// -webkit-overflow-scrolling: touch allow iframe scrolling for iOS
const ResponsiveIframeContainer = styled('div')`
  -webkit-overflow-scrolling: touch;
  position: relative;
  padding-top: 100vh;
  overflow: auto;
`;

const ResponsiveIframe = styled('iframe')`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
`;