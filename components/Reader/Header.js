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

const Menu = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  color: #8a8888;

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
    border-left: 1px solid #e3e3e3;
  }
`;

const Button = styled.button.attrs({
  type: 'button',
})`
  background: transparent;
  align-self: stretch;
  border-radius: 0;
  border: none;
  color: #444;
  padding-left: 10px;
  padding-right: 10px;
  :disabled {
    color: #ddd;
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
  <Menu>
    <BookTitle>{props.title}</BookTitle>
    <Button>
      <MdFontDownload />
    </Button>
    <Button aria-label="Close book" title="Close book" onClick={props.onClose}>
      <MdClose />
    </Button>
  </Menu>
);

export { Header as default, Button };
