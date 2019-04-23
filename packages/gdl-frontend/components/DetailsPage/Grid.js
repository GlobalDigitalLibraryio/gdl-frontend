// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import styled from '@emotion/styled';

import media from '../../style/media';

const Grid = styled('div')(
  media.tablet`
      display: flex;
      width: calc(100% + 40px);
      margin-left: -20px;
      margin-right: -20px;
    `
);

export default Grid;
