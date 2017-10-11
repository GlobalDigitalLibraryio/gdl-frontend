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
import media from '../helpers/media';
import { Button } from './Header';

type Props = {
  onNextChapter(): void,
  onPrevChapter(): void,
  disableNext: boolean,
  disablePrev: boolean,
  children: React.Node,
};

const Container = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  color: #8a8888;

  font-size: 12px;
  min-height: 48px;
  ${media.tablet`
    min-height: 54px;
    font-size: 14px;
  `};

  & button:first-child {
    margin-right: auto;
  }

  & button:last-child {
    margin-left: auto;
  }
`;

const Footer = (props: Props) => (
  <Container>
    <Button
      onClick={props.onPrevChapter}
      disabled={props.disablePrev}
      aria-label="Previous chapter"
      title="Previous chapter"
    >
      <MdKeyboardArrowLeft />
    </Button>
    {props.children}
    <Button
      onClick={props.onNextChapter}
      disabled={props.disableNext}
      aria-label="Next chapter"
      title="Next chapter"
    >
      <MdKeyboardArrowRight />
    </Button>
  </Container>
);

export default Footer;
