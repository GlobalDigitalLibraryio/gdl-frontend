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

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import { spacing, misc } from '../../style/theme';
import media from '../../style/media';
import { Hidden } from '../../elements';
import GameLink from './GameLink';
import BookLink from './BookLink';
import LevelHR from '../Level/LevelHR';
import BrowseLink, { type Props as BrowseLinkProps } from '../BrowseLink';

import type { Book } from './BookLink';
import { coverWidths } from './coverWidths';

import type { Games_games as Game, ReadingLevel } from '../../gqlTypes';

type Props = {
  loadMore: () => void,
  goBack: () => void,
  pageInfo: any,
  items: $ReadOnlyArray<Game | Book>,
  heading: typeof Trans,
  browseLinkProps?: BrowseLinkProps,
  level?: ReadingLevel | 'Games',
  shouldBeColorized?: boolean
};

// Add a wrapper around each book or game list, so we can apply padding on the last element to get our wanted "overscroll effect" on mobile
export default ({
  loadMore,
  goBack,
  pageInfo,
  items,
  heading,
  browseLinkProps,
  level,
  shouldBeColorized
}: Props) => {
  return (
    <ScrollContainer>
      <Header>
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
              <Trans>More</Trans>
            </Button>
          </BrowseLink>
        )}
      </Header>

      {/* Adjust the space between items and the hr */}
      {shouldBeColorized && <LevelHR level={level} css={levelStyle} />}
      <Hidden only="tablet">
        <PaginatedView
          goBack={goBack}
          pageInfo={pageInfo}
          level={level}
          loadMore={loadMore}
          items={items}
        />
      </Hidden>
      <Hidden only="mobile">
        <InfiniteScrollView items={items} loadMore={loadMore} />
      </Hidden>
    </ScrollContainer>
  );
};

const PaginatedView = ({ goBack, pageInfo, level, loadMore, items }) => (
  <div style={{ display: 'flex', flexDirection: 'row' }}>
    <div css={arrowStyle}>
      <Fab color="primary" aria-label="Add" onClick={goBack}>
        <AddIcon />
      </Fab>
    </div>

    <Scroller>
      {items
        .slice((pageInfo.page - 1) * 5, pageInfo.page * 5)
        .map((item: any) => (
          <div className={itemStyle} key={item.id}>
            {level === 'Games' ? (
              <GameLink game={(item: Game)} />
            ) : (
              <BookLink book={(item: Book)} />
            )}
          </div>
        ))}
    </Scroller>
    <div css={arrowStyle}>
      <Fab color="primary" aria-label="Add" onClick={loadMore}>
        <AddIcon />
      </Fab>
    </div>
  </div>
);

const arrowStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const levelStyle = css`
  margin-bottom: ${spacing.medium};
  ${media.tablet`
    max-width: ${misc.containers.small};
  `}
`;

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
    const { items } = this.props;
    return (
      <Scroller ref={this.scrollerRef}>
        {items.map((item: any) => (
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

const Header = styled('div')`
  position: relative;
  display: flex;
  flex-direction: column;
  /* fix flexbox bugs */
  min-height: 0;
  min-width: 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  visibility: ${p => (p.hide ? 'hidden' : 'visible')};

  ${media.tablet`
    width: 100%;
    max-width: ${misc.containers.small}px;
  `};
`;

const ScrollContainer = styled('div')`
  visibility: ${p => (p.hide ? 'hidden' : 'visible')};
  ${media.tablet`
    display: flex;
    align-items: center;
    flex-direction: column;
  `};
`;
export const COLUMN_GAP = 15;

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

  ${media.tablet`
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
    @media (max-width: ${COLUMN_GAP * 4 +
      coverWidths.small * 5 +
      misc.gutter * 2}px) {
      grid-template-columns: repeat(4, ${
        coverWidths.small
      }px) ${coverWidths.small + misc.gutter}px;
    }
  }
  `}
`;
