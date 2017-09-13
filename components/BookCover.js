// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import styled from 'styled-components';
import type { Book } from '../types';

const Img = styled.img`
  max-height: 105px;
  max-width: 105px;
  border-radius: 4px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  display: block;
`;

export default ({ book }: { book: Book }) => (
  <Img src={book.coverPhoto.small} alt={book.title} aria-hidden />
);
