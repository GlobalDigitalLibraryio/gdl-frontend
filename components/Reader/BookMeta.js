// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import styled from 'styled-components';

const Div = styled.div`
  font-size: 14px;
  color: #adadad;
  text-align: center;
`;

type Props = {
  title?: string,
};

const BookMeta = (props: Props) => <Div>{props.title}</Div>;

export default BookMeta;
