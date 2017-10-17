// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import styled from 'styled-components';
import { ellipsis } from 'polished';
import { MdFontDownload, MdClose } from 'react-icons/lib/md';
import media from '../helpers/media';

const Div = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  color: ${props => props.theme.grays.jumbo};

  font-size: 14px;
  min-height: 48px;
  ${media.tablet`
    min-height: 54px;
    font-size: 16px;
  `};

  & button:first-of-type {
    margin-left: auto;
  }

  & button:last-child {
    border-left: 1px solid ${props => props.theme.grays.platinum};
  }
`;

const Button = styled.button.attrs({
  type: 'button',
})`
  background: transparent;
  align-self: stretch;
  border-radius: 0;
  border: none;
  color: ${props => props.theme.grays.dark};
  padding-left: 10px;
  padding-right: 10px;
  :disabled {
    color: ${props => props.theme.grays.gainsboro};
  }
`;

const BookTitle = styled.h2`
  margin: 0;
  margin-left: 20px;
  font-size: inherit;
  font-weight: normal;
  ${ellipsis()};
`;

type Props = {
  onClose(): void,
  title: string,
};

const Header = (props: Props) => (
  <Div>
    <BookTitle>{props.title}</BookTitle>
    <Button>
      <MdFontDownload />
    </Button>
    <Button aria-label="Close book" title="Close book" onClick={props.onClose}>
      <MdClose />
    </Button>
  </Div>
);

export { Header as default, Button };
