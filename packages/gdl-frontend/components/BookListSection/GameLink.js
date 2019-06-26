// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { CardContent, Typography } from '@material-ui/core';
import CustomCard from './CustomCard';

import { Link } from '../../routes';
import CoverImage from '../CoverImage';
import ClickTarget from './ClickTarget';

import type { game_game as Game } from '../../gqlTypes';

/**
 * Adds an absolute anchor above the whole cover, so you can click anywhere.
 * It is hidden from screen readers and when using the keyboard, in that case the title is also a link.
 */
export default ({ game }: { game: Game }) => (
  <CustomCard>
    <Link route="game" params={{ id: game.id, lang: game.language }} passHref>
      <ClickTarget aria-hidden tabIndex="-1" data-cy="game-link" />
    </Link>
    <CoverImage size="small" coverImage={game.coverImage} noShadow />
    <CardContent css={{ padding: 10, ':last-child': { paddingBottom: 10 } }}>
      <Link route="game" params={{ id: game.id, lang: game.language }} passHref>
        <Typography
          lang={game.language}
          title={game.title}
          noWrap
          component="a"
          align="center"
        >
          {game.title}
        </Typography>
      </Link>
    </CardContent>
  </CustomCard>
);
