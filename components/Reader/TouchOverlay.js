// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import styled from 'styled-components';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/lib/md';

const Div = styled.button`
  color: #fff;
  position: fixed;
  background-color: rgba(68, 68, 68, 0.2);
  height: 100%;
  width: 70px;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-style: none;
`;

type Props = {
  onRequestNext(event: SyntheticEvent<HTMLButtonElement>): void,
  onRequestPrev(event: SyntheticEvent<HTMLButtonElement>): void,
};

const TouchOverlay = (props: Props) => [
  <Div key="left" style={{ left: 0 }} onClick={props.onRequestPrev}>
    <MdKeyboardArrowLeft size={50} />
  </Div>,
  <Div key="right" style={{ right: 0 }} onClick={props.onRequestNext}>
    <MdKeyboardArrowRight size={50} />
  </Div>,
];

export default TouchOverlay;
