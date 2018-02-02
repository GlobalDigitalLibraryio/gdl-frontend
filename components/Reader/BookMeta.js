// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import styled from 'react-emotion';
import media from '../../style/media';

const Div = styled.div`
  margin-top: 30px;
  font-size: 14px;
  color: #adadad;
  text-align: center;
  ${media.tablet`
    margin-top: 40px;
  `};
`;

type Props = {
  title?: string
};

const BookMeta = (props: Props) => <Div>{props.title}</Div>;

export default BookMeta;
