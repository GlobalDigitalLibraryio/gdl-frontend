// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

import styled from '@emotion/styled';

import media from '../../style/media';

const GridItem = styled('div')(
  media.tablet`
    flex-grow: 1;
    padding-left: 20px;
    padding-right: 20px;
   `
);

export default GridItem;
