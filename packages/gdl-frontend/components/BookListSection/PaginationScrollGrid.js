// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import styled from '@emotion/styled';

import { misc } from '../../style/theme';
import media from '../../style/media';
import { coverWidths } from './coverWidths';

const COLUMN_GAP = 15;
/* This carefully calcluated value allows us to "scroll" across gutter on devices that require it */
const GUTTER_GAP = COLUMN_GAP * 4 + coverWidths.small * 5 + misc.gutter * 2;

const PaginationScrollGrid = styled('div')`
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

export default PaginationScrollGrid;
