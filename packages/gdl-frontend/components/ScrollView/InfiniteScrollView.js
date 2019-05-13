// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import React, { Component } from 'react';
import { Button, Typography, CircularProgress } from '@material-ui/core';
import { Trans } from '@lingui/react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

import { View } from '../../elements';
import { spacing, misc } from '../../style/theme';
import BookLink from './BookLink';
import LevelHR from '../Level/LevelHR';
import { type Props as BrowseLinkProps } from '../BrowseLink';
import type { Book } from './BookLink';

import type { Games_games as Game, ReadingLevel } from '../../gqlTypes';

type Props = {
  loadMore: () => void,
  items: $ReadOnlyArray<Game | Book>,
  loading?: boolean,
  heading: typeof Trans,
  browseLinkProps?: BrowseLinkProps,
  level?: ReadingLevel | 'Games',
  shouldBeColorized?: boolean
};

// Add a wrapper around each book or game list, so we can apply padding on the last element to get our wanted "overscroll effect" on mobile
export default ({
  loadMore,
  items,
  loading,
  heading,
  browseLinkProps,
  level,
  shouldBeColorized
}: Props) => {
  return (
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
          <Button
            onClick={loadMore}
            data-cy="browse-more-button"
            color="primary"
            size="small"
            variant="outlined"
          >
            <Trans>More</Trans>
          </Button>
        )}
      </View>

      {/* Adjust the space between items and the hr */}
      {shouldBeColorized && (
        <LevelHR level={level} css={{ marginBottom: spacing.medium }} />
      )}
      <InfiniteScrollView loading={loading} items={items} loadMore={loadMore} />
    </div>
  );
};

const itemStyle = css`
  display: inline-block;
`;

const loadingStyle = css`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  width: 30px;
  height: 100%;
`;

class InfiniteScrollView extends Component<{
  loading?: boolean,
  items: $ReadOnlyArray<Game | Book>,
  loadMore: () => void
}> {
  scrollerRef = React.createRef<HTMLElement>();

  handleScroll = (event: Event) => {
    const target: HTMLElement = (event.currentTarget: any);
    if (target.scrollLeft + target.clientWidth >= target.scrollWidth) {
      this.props.loadMore();
    }
  };

  componentDidMount() {
    const list = this.scrollerRef.current;
    if (list) {
      list.addEventListener('scroll', this.handleScroll);
    }
  }
  componentWillUnmount() {
    const list = this.scrollerRef.current;
    if (list) {
      list.removeEventListener('scroll', this.handleScroll);
    }
  }

  render() {
    const { loading, items } = this.props;
    return (
      <Scroller ref={this.scrollerRef}>
        {!loading &&
          items.map((item: any) => (
            <div css={itemStyle} key={item.id}>
              <BookLink book={(item: Book)} />
            </div>
          ))}
        <div css={itemStyle}>
          <div css={loadingStyle}>
            <CircularProgress size={25} />
          </div>
        </div>
      </Scroller>
    );
  }
}

const Scroller = styled('div')`
  overflow-x: scroll;
  /* Fixes problem with scrolling in Safari all over the place */
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  white-space: nowrap;

  display: flex;
  flex-direction: row;

  /* Ensure the box-shadow isn't cut off and allows us to "scroll" on the edges/across the gutters  */
  margin: 0 -${misc.gutter}px -${misc.gutter}px;
  padding: 0 ${misc.gutter}px ${misc.gutter}px;
`;
