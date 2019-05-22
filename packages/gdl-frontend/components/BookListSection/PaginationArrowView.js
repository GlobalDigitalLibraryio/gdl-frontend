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

import colorMap from '../../style/colorMapping';
import GameLink from './GameLink';
import BookLink from './BookLink';
import PaginationScrollGrid from './PaginationScrollGrid';

import type { Book } from './BookLink';
import type { Games_games as Game, ReadingLevel } from '../../gqlTypes';

type Props = {
  loading: boolean,
  goBack: () => void,
  pageInfo: any,
  level?: ReadingLevel | 'Games',
  loadMore: () => void,
  items: $ReadOnlyArray<Game | Book>,
  hasNextPage: boolean,
  hasPreviousPage: boolean
};

const PaginationArrowView = ({
  loading,
  goBack,
  pageInfo,
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
  `;

  const backStyle = css`
    visibility: ${hasPreviousPage ? 'visible' : 'hidden'};
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  const forwardStyle = css`
    visibility: ${hasNextPage ? 'visible' : 'hidden'};

    display: flex;
    justify-content: center;
    align-items: center;
  `;

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div css={backStyle}>
        <ButtonBase css={buttonStyle} aria-label="Add" onClick={goBack}>
          <KeyboardArrowLeft fontSize="large" />
        </ButtonBase>
      </div>

      <PaginationScrollGrid>
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
      </PaginationScrollGrid>
      <div css={forwardStyle}>
        <ButtonBase
          css={buttonStyle}
          aria-label="Add"
          onClick={loadMore}
          disabled={loading}
        >
          <KeyboardArrowRight fontSize="large" />
        </ButtonBase>
      </div>
    </div>
  );
};

const itemStyle = css`
  display: inline-block;
`;

export default PaginationArrowView;
