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
import { Button } from './Toolbar';

type Props = {
  onRequestNext(): void,
  onRequestPrevious(): void,
  disableNext: boolean,
  disablePrev: boolean,
  children: React.Node,
};

const Nav = styled.nav`
  display: none;

  ${media.tablet`
    position: sticky;
    bottom: 0;
    align-items: center;
    flex: 0 0 auto;
    color: ${props => props.theme.grays.jumbo};
    background-color: ${props => props.theme.grays.desertStorm};
    border-top: 1px solid ${props => props.theme.grays.platinum};
    display: flex;
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
  <Nav>
    <Button
      onClick={props.onRequestPrevious}
      disabled={props.disablePrev}
      aria-label="Previous chapter"
      title="Previous chapter"
    >
      <MdKeyboardArrowLeft />
    </Button>
    {props.children}
    <Button
      onClick={props.onRequestNext}
      disabled={props.disableNext}
      aria-label="Next chapter"
      title="Next chapter"
    >
      <MdKeyboardArrowRight />
    </Button>
  </Nav>
);

export default Footer;
