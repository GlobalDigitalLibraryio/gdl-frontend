// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import React, { Component } from 'react';
import { CircularProgress } from '@material-ui/core';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

import { misc } from '../../style/theme';
import media from '../../style/media';
import { LARGER_TABLET_BREAKPOINT } from '../../style/theme/misc';
import BookLink from './BookLink';
import GameLink from './GameLink';
import { coverWidths } from './coverWidths';

import type { Book } from './BookLink';
import type { Games_games as Game } from '../../gqlTypes';

const loadingStyle = css`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  width: 30px;
  height: 100%;
`;

const itemStyle = css`
  display: inline-block;
`;

type Props = {
  hasMore: boolean,
  level?: ReadingLevel | 'Games',
  items: $ReadOnlyArray<Game | Book>,
  loadMore: () => void
};

export default class InfiniteScrollView extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return this.props.items.length <= nextProps.items.length;
  }
  scrollerRef = React.createRef<HTMLElement>();

  handleScroll = (event: Event) => {
    const target: HTMLElement = (event.currentTarget: any);

    if (target.scrollLeft + target.clientWidth >= target.scrollWidth) {
      this.props.loadMore();
    }
  };

  componentDidMount() {
    // On smaller screen, the circular loader is shown so we want to auto loadmore
    if (
      window.innerWidth > 600 &&
      window.innerWidth < LARGER_TABLET_BREAKPOINT
    ) {
      this.props.hasMore && this.props.loadMore();
    }
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
    const { items, hasMore, level } = this.props;
    return (
      <Scroller ref={this.scrollerRef}>
        {items.map((item: any) => (
          <div css={itemStyle} key={item.id}>
            {level === 'Games' ? (
              <GameLink game={(item: Game)} />
            ) : (
              <BookLink book={(item: Book)} />
            )}
          </div>
        ))}
        {hasMore && (
          <div css={itemStyle} tabIndex="0" aria-label="loading more books">
            <div css={loadingStyle}>
              <CircularProgress size={25} />
            </div>
          </div>
        )}
      </Scroller>
    );
  }
}

const COLUMN_GAP = 15;
/* This carefully calcluated value allows us to "scroll" across gutter on devices that require it */
const GUTTER_GAP = COLUMN_GAP * 4 + coverWidths.small * 5 + misc.gutter * 2;

const Scroller = styled('div')`
  overflow-x: scroll;
  /* Fixes problem with scrolling in Safari all over the place */
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  white-space: nowrap;

  /* Ensure the box-shadow isn't cut off and allows us to "scroll" on the edges/across the gutters  */
  margin: 0 -${misc.gutter}px -${misc.gutter}px;
  padding: 0 ${misc.gutter}px ${misc.gutter}px;

  display: flex;
  flex-direction: row;

  ${media.largerTablet`
    ::-webkit-scrollbar {
      display: none;
    }
    width: ${misc.containers.small + misc.gutter * 2}px;
    margin: 0 0 -${misc.gutter}px;

    @supports (display: grid) {
      display: grid;
      justify-content: space-between;
      grid-gap: ${COLUMN_GAP}px;
      grid-auto-flow: column;

      grid-template-columns: repeat(5, ${coverWidths.large}px);

      /* This carefully calcluated value allows us to "scroll" across gutter on devices that require it */
      @media (max-width: ${GUTTER_GAP}px) {
        grid-template-columns: repeat(4, ${
          coverWidths.small
        }px) ${coverWidths.small + misc.gutter}px;
      }
    }
  `}
`;
