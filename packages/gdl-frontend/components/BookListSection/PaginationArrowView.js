// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { ButtonBase } from '@material-ui/core';
import { css } from '@emotion/core';
import { KeyboardArrowRight, KeyboardArrowLeft } from '@material-ui/icons';
import styled from '@emotion/styled';

import colorMap from '../../style/colorMapping';
import GameLink from './GameLink';
import BookLink from './BookLink';
import PaginationScrollGrid from './PaginationScrollGrid';
import { AMOUNT_OF_ITEMS_PER_LEVEL } from '../HomePage';

import type { Book } from './BookLink';
import type {
  GameList_games_results as Game,
  ReadingLevel
} from '../../gqlTypes';

type Props = {
  loading: boolean,
  goBack: () => void,
  currentIndex: number,
  level?: ReadingLevel | 'Games',
  loadMore: () => void,
  items: $ReadOnlyArray<Game | Book>,
  hasNextPage: boolean,
  hasPreviousPage: boolean
};

const PaginationArrowView = ({
  loading,
  goBack,
  currentIndex,
  level,
  loadMore,
  items,
  hasNextPage,
  hasPreviousPage
}: Props) => {
  const buttonStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: 2px solid ${level ? colorMap[level] : '#B4A4E5'};
    border-radius: 50%;

    &:hover,
    &:focus {
      transition: all 0.2s ease-in;
      background-color: ${level ? colorMap[level] : '#B4A4E5'};
    }
  `;

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <ButtonContainer level={level}>
        {hasPreviousPage && (
          <ButtonBase css={buttonStyle} aria-label="Add" onClick={goBack}>
            <KeyboardArrowLeft fontSize="large" />
          </ButtonBase>
        )}
      </ButtonContainer>

      <PaginationScrollGrid>
        {items
          .slice(
            (currentIndex - 1) * AMOUNT_OF_ITEMS_PER_LEVEL,
            currentIndex * AMOUNT_OF_ITEMS_PER_LEVEL
          )
          .map((item: any) => (
            <div className={itemStyle} key={item.id}>
              {level === 'Games' ? (
                <GameLink game={(item: Game)} />
              ) : (
                <BookLink book={(item: Book)} />
              )}
            </div>
          ))}
      </PaginationScrollGrid>

      <ButtonContainer level={level}>
        {hasNextPage && (
          <ButtonBase
            css={buttonStyle}
            aria-label="Add"
            onClick={loadMore}
            disabled={loading}
          >
            <KeyboardArrowRight fontSize="large" />
          </ButtonBase>
        )}
      </ButtonContainer>
    </div>
  );
};

const ButtonContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 100%;
`;

const itemStyle = css`
  display: inline-block;
`;

export default PaginationArrowView;
