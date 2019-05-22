// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import React, { Component } from 'react';
import { Button, Typography } from '@material-ui/core';
import { Trans } from '@lingui/react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

import { spacing, misc } from '../../style/theme';
import media from '../../style/media';
import { Hidden } from '../../elements';
import LevelHR from '../Level/LevelHR';
import BrowseLink, { type Props as BrowseLinkProps } from '../BrowseLink';
import CarouselDots from './CarouselDots';
import InfiniteScrollView from './InfiniteScrollView';
import PaginationArrowView from './PaginationArrowView';

import type { Book } from './BookLink';
import type { Games_games as Game, ReadingLevel } from '../../gqlTypes';

type Props = {
  loadMore: () => void,
  goBack: () => void,
  pageInfo: any,
  loading: boolean,
  items: $ReadOnlyArray<Game | Book>,
  heading: typeof Trans,
  browseLinkProps?: BrowseLinkProps,
  level?: ReadingLevel | 'Games',
  shouldBeColorized?: boolean
};

// Add a wrapper around each book or game list, so we can apply padding on the last element to get our wanted "overscroll effect" on mobile
export default class PaginationSection extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return this.props.items.length <= nextProps.items.length;
  }

  render() {
    const {
      loading,
      loadMore,
      goBack,
      pageInfo,
      items,
      heading,
      browseLinkProps,
      level,
      shouldBeColorized
    } = this.props;

    return (
      <Section>
        <Header>
          <Typography component="h1" variant="h5" style={{ textAlign: 'left' }}>
            {heading}
          </Typography>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            {/* Dont want to show dots if there is only one page */}
            {pageInfo.pageCount > 1 && (
              <Hidden only="desktop">
                <CarouselDots
                  length={pageInfo.pageCount}
                  current={pageInfo.page - 1}
                />
              </Hidden>
            )}
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
          </div>
        </Header>

        {/* Adjust the space between items and the hr */}
        {shouldBeColorized && <LevelHR level={level} css={levelStyle} />}
        <Hidden only="desktop">
          <PaginationArrowView
            loading={loading}
            goBack={goBack}
            pageInfo={pageInfo}
            level={level}
            loadMore={loadMore}
            items={items}
            hasNextPage={pageInfo.hasNextPage}
            hasPreviousPage={pageInfo.hasPreviousPage}
          />
        </Hidden>
        <Hidden only="mobileAndTablet">
          <InfiniteScrollView
            items={items}
            loadMore={loadMore}
            hasMore={pageInfo.hasNextPage}
          />
        </Hidden>
      </Section>
    );
  }
}

const levelStyle = css`
  margin-bottom: ${spacing.medium};
  ${media.tablet`
    max-width: ${misc.containers.small};
  `}
`;

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

const Section = styled('div')`
  visibility: ${p => (p.hide ? 'hidden' : 'visible')};

  ${media.largerTablet`
    display: flex;
    align-items: center;
    flex-direction: column;
  `};
`;