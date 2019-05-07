// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

import { View, Scroller, Shimmer } from '../../elements';
import { itemStyle } from '../../elements/Shimmer';
import { spacing } from '../../style/theme';
import GameLink from './GameLink';
import BookLink from './BookLink';
import LevelHR from '../Level/LevelHR';
import BrowseLink, { type Props as BrowseLinkProps } from '../BrowseLink';
import type { Book } from './BookLink';

import type { Games_games as Game, ReadingLevel } from '../../gqlTypes';

type Props = {
  items: $ReadOnlyArray<Game | Book>,
  loading?: boolean,
  heading: typeof FormattedMessage,
  browseLinkProps?: BrowseLinkProps,
  level?: ReadingLevel | 'Games',
  shouldBeColorized?: boolean
};

// Add a wrapper around each book or game list, so we can apply padding on the last element to get our wanted "overscroll effect" on mobile
const ScrollView = ({
  items,
  loading,
  heading,
  browseLinkProps,
  level,
  shouldBeColorized
}: Props) => (
  <div
    css={{
      visibility: `${!loading && items.length === 0 ? 'hidden' : 'visible'}`
    }}
  >
    <View
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      style={{
        visibility: !loading && items.length === 0 ? 'hidden' : 'visible'
      }}
    >
      <Typography component="h1" variant="h5" style={{ textAlign: 'left' }}>
        {heading}
      </Typography>
      {browseLinkProps && (
        <BrowseLink {...browseLinkProps}>
          {/* Negative margin to align the link against the edge of the container */}
          <Button
            data-cy="browse-more-button"
            color="primary"
            size="small"
            variant="outlined"
          >
            <FormattedMessage id="More" defaultMessage="More" />
          </Button>
        </BrowseLink>
      )}
    </View>

    {/* Adjust the space between items and the hr */}
    {shouldBeColorized && (
      <LevelHR level={level} css={{ marginBottom: spacing.medium }} />
    )}
    <Scroller>
      {loading
        ? [...Array(5)].map((_, index) => <Shimmer key={index} />)
        : items.slice(0, 5).map((item: any) => (
            <div className={itemStyle} key={item.id}>
              {level === 'Games' ? (
                <GameLink game={(item: Game)} />
              ) : (
                <BookLink book={(item: Book)} />
              )}
            </div>
          ))}
    </Scroller>
  </div>
);

export default ScrollView;
