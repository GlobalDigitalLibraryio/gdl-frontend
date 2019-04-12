// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import styled from '@emotion/styled';

import { misc } from '../style/theme';
import media from '../style/media';
import { coverWidths } from '../components/ScrollView/coverWidths';

export const COLUMN_GAP = 15;

/**
 * We use CSS grid for browsers that support it.
 * So we get the nice fluid/dynamic spacing between the items (down the minimum value set the as the column gap)
 *
 * Currently this is coded to show at the most 5 item covers (so the spacing is the same between the items even if there are fewer than 5 items)
 */

const Scroller = styled('div')`
  overflow-x: auto;
  /* Fixes problem with scrolling in Safari all over the place */
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  white-space: nowrap;
  ::-webkit-scrollbar {
    display: none;
  }

  /* Ensure the box-shadow isn't cut off and allows us to "scroll" on the edges/across the gutters  */
  margin: 0 -${misc.gutter}px -${misc.gutter}px;
  padding: 0 ${misc.gutter}px ${misc.gutter}px;

  @supports (display: grid) {
    display: grid;
    justify-content: space-between;
    grid-gap: ${COLUMN_GAP}px;
    grid-auto-flow: column;

    grid-template-columns: repeat(5, ${coverWidths.small}px);

    /* This carefully calcluated value allows us to "scroll" across gutter on devices that require it */
    @media (max-width: ${COLUMN_GAP * 4 +
        coverWidths.small * 5 +
        misc.gutter * 2}px) {
      grid-template-columns: repeat(4, ${coverWidths.small}px) ${coverWidths.small +
          misc.gutter}px;
    }

    ${media.tablet`
      grid-template-columns: repeat(5, ${coverWidths.large}px);
    `};
  }
`;

export default Scroller;
