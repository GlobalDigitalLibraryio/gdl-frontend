// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Card } from '@material-ui/core';
import styled from '@emotion/styled';
import Toolbar from './Toolbar';
import { Container } from '../../elements';
import { Backdrop } from '../../components/Reader/styledReader';
import media from '../../style/media';

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
  overflow: auto;
  padding-top: calc(100vh - 50px);
  ${media.tablet`
    padding-top: calc(100vh - 98px);
  `};
`;

const ResponsiveIframe = styled('iframe')`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
`;
