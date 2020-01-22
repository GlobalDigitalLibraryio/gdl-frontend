// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import React, { Component } from 'react';
import { Button, Typography } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
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
import type {
  GameList_games_results as Game,
  ReadingLevel
} from '../../gqlTypes';

type Props = {
  loadMore: () => void,
  goBack: () => void,
  pageInfo: any,
  loading: boolean,
  languageCode: string,
  items: $ReadOnlyArray<Game | Book>,
  heading: typeof FormattedMessage,
  browseLinkProps?: BrowseLinkProps,
  level?: ReadingLevel | 'Games',
  shouldBeColorized?: boolean
};

// Add a wrapper around each book or game list, so we can apply padding on the last element to get our wanted "overscroll effect" on mobile
export default class PaginationSection extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return (
      this.props.languageCode !== nextProps.languageCode ||
      // Check for items.length as precedence to not allow rerendring of elements
      // with the same key, when spamming.
      this.props.items.length <= nextProps.items.length ||
      this.props.items !== nextProps.items
    );
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
                  variant="contained"
                >
                  <FormattedMessage id="More" defaultMessage="More" />
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
            currentIndex={pageInfo.page}
            hasNextPage={pageInfo.hasNextPage}
            hasPreviousPage={pageInfo.hasPreviousPage}
          />
        </Hidden>
        <Hidden only="mobileAndTablet">
          <InfiniteScrollView
            items={items}
            level={level}
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
