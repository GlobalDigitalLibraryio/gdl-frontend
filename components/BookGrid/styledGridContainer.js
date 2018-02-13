// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import styled from 'react-emotion';
import media from '../../style/media';

/**
 * For browsers that support it. Use the CSS grid
 */

const GridContainer = styled('div')`
  a {
    display: inline-block;
    margin: 7.5px;
  }

  @supports (display: grid) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(105px, 1fr));
    grid-gap: 15px;
    justify-items: center;
    ${media.tablet`
      grid-gap: 20px;
    `};

    a {
      margin: 0;
    }
  }
`;

export default GridContainer;
