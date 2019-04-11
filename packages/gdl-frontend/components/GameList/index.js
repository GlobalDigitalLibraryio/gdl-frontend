// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { Typography } from '@material-ui/core';

import View from '../../elements/View';
import { spacing, misc } from '../../style/theme/';
import media from '../../style/media';
import GameLink, { coverWidths } from './GameLink';
import LevelHR from '../Level/LevelHR';
import Shimmer from './Shimmer';

// Add a wrapper around each book list, so we can apply padding on the last element to get our wanted "overscroll effect" on mobile
const GameList = ({ games, loading }) => (
  <div
    css={{
      visibility: `${!loading && games.length === 0 ? 'hidden' : 'visible'}`
    }}
  >
    <View
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      style={{
        visibility: !loading && games.length === 0 ? 'hidden' : 'visible'
      }}
    >
      <Typography component="h1" variant="h5" style={{ textAlign: 'left' }}>
        Games
      </Typography>
    </View>
    {/* Adjust the space between games and the hr */}
    <LevelHR level="Games" css={{ marginBottom: spacing.medium }} />
    <Scroller>
      {loading
        ? [...Array(5)].map((_, index) => (
            <div css={[itemStyle, shimmerStyle]} key={index}>
              <Shimmer className={shimmerStyle} />
            </div>
          ))
        : games.slice(0, 5).map(game => (
            <div className={itemStyle} key={game.id}>
              <GameLink game={game} />
            </div>
          ))}
    </Scroller>
  </div>
);

const shimmerStyle = css`
  &:last-child {
    margin-right: ${coverWidths.large - coverWidths.small}px;
  }
  width: ${coverWidths.small}px;
  ${media.tablet`
  width: ${coverWidths.large}px;
`};
`;

const COLUMN_GAP = 15;
/**
 * For browsers that doesn't support grid we add some spacing around the book covers
 */
const itemStyle = css`
  display: inline-block;
  &:not(:last-child) {
    margin-right: ${COLUMN_GAP}px;
  }
  @supports (display: grid) {
    margin-right: 0 !important;
  }
`;

/**
 * We use CSS grid for browsers that support it.
 * So we get the nice fluid/dynamic spacing between the items (down the minimum value set the as the column gap)
 *
 * Currently this is coded to show at the most 5 book covers (so the spacing is the same between the items even if there are fewer than 5 books)
 */

const Scroller = styled('div')`
  overflow-x: auto;
  /* Fixes problem with scrolling in Safari all over the place */
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  white-space: nowrap;
  ::-webkit-scrollbar {
    display: none;
  }

  /* Ensure the box-shadow isn't cut off and allows us to "scroll" on the edges/across the gutters  */
  margin: 0 -${misc.gutter}px -${misc.gutter}px;
  padding: 0 ${misc.gutter}px ${misc.gutter}px;

  @supports (display: grid) {
    display: grid;
    justify-content: space-between;
    grid-gap: ${COLUMN_GAP}px;
    grid-auto-flow: column;

    grid-template-columns: repeat(5, ${coverWidths.small}px);

    /* This carefully calcluated value allows us to "scroll" across gutter on devices that require it */
    @media (max-width: ${COLUMN_GAP * 4 +
        coverWidths.small * 5 +
        misc.gutter * 2}px) {
      grid-template-columns: repeat(4, ${coverWidths.small}px) ${coverWidths.small +
          misc.gutter}px;
    }

    ${media.tablet`
      grid-template-columns: repeat(5, ${coverWidths.large}px);
    `};
  }
`;

export default GameList;
