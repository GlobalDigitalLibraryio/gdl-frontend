// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import styled from 'styled-components';
import media from '../helpers/media';

const Lines = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:before,
  &:after {
    display: block;
    flex: 1;
    height: 1px;
    content: '';
    background-color: ${p => p.theme.grays.platinum};
    width: 90px;
    margin: 20px;
  }
`;

const Div = styled.div`
  font-size: 14px;
  color: #adadad;
  text-align: center;
  ${media.tablet`
    display: ${p => (p.hideOnTablet ? 'none' : 'block')};
  `};
`;

type Props = {
  currentChapter: number,
  totalChapters: number,
  title?: string,
  hideOnTablet: boolean,
};

const BookMeta = (props: Props) => (
  <Div hideOnTablet={props.hideOnTablet}>
    <Lines>
      {props.currentChapter} / {props.totalChapters}
    </Lines>
    {props.title}
  </Div>
);

BookMeta.defaultProps = {
  hideOnTablet: false,
};

export default BookMeta;
