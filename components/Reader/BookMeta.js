// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import styled from 'react-emotion';
import type { BookDetails } from '../../types';
import media from '../../style/media';
import { colors } from '../../style/theme';

const Div = styled.div`
  margin-top: 30px;
  font-size: 14px;
  color: ${colors.text.subtle};
  text-align: center;
  ${media.tablet`
    margin-top: 40px;
  `};
`;

type Props = {
  book: BookDetails
};

const BookMeta = ({ book }: Props) => <Div>{book.title}</Div>;

export default BookMeta;
