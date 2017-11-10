// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/lib/md';
import styled from 'styled-components';
import media from '../helpers/media';

const Div = styled.button`
  color: #fff;
  position: fixed;
  background-color: rgba(68, 68, 68, 0.1);
  height: 100%;
  width: 70px;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-style: none;
  ${media.tablet`
    background: none; 
    color: #444;
    
    &:hover, &:focus {
      background: linear-gradient(90deg,rgba(1,1,1,0),rgba(1,1,1,0.3));
      color: #fff;
    }
    transition: color 0.3s ease;
    width: 120px;

  `};
`;

type Props = {
  onRequestNext(event: SyntheticEvent<HTMLButtonElement>): void,
  onRequestPrev(event: SyntheticEvent<HTMLButtonElement>): void,
};

const TouchOverlay = (props: Props) => [
  <Div
    key="left"
    style={{ left: 0 }}
    onClick={props.onRequestPrev}
    type="button"
  >
    <MdKeyboardArrowLeft size={50} />
  </Div>,
  <Div
    key="right"
    style={{ right: 0 }}
    onClick={props.onRequestNext}
    type="button"
  >
    <MdKeyboardArrowRight size={50} />
  </Div>,
];

export default TouchOverlay;
