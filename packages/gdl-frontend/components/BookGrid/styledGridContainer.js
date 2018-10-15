// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled from 'react-emotion';
import { coverWidths } from '../BookLink';
import media from '../../style/media';

/**
 * For browsers that support it. Use the CSS grid so it gets nicely centered.
 */

const GridContainer = styled('div')`
  > div {
    display: inline-block;
    margin: 7.5px;
  }

  @supports (display: grid) {
    display: grid;
    grid-template-columns: repeat(auto-fill, ${coverWidths.small}px);
    justify-content: center;
    grid-gap: 15px;
    ${media.tablet`
      grid-template-columns: repeat(auto-fill, ${coverWidths.large}px);
      grid-gap: 30px;
    `};

    > div {
      margin: 0;
    }
  }
`;

export default GridContainer;
