// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */
import * as React from 'react';
import styled from 'styled-components';
import Box from './Box';
import type { Book } from '../types';

const Img = styled.img`
  border-radius: 4px;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.12);
  max-width: 100%;
  max-height: 100%;
  display: block;
  margin-left: auto;
`;

export default ({ book, ...props }: { book: Book }) => (
  <Box mw={['130px', '250px']} mh={['130px', '250px']} {...props}>
    <Img src={book.coverPhoto.small} alt={book.title} aria-hidden />
  </Box>
);
