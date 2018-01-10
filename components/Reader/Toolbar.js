// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import styled from 'react-emotion';
import { Trans } from 'lingui-react';
import { MdClose } from 'react-icons/lib/md';
import SrOnly from '../SrOnly';
import theme from '../../style/theme';
import media from '../../style/media';
import { flexCenter } from '../../style/flex';

const Div = styled.div`
  position: relative;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  color: ${theme.colors.grayDark};
  border-bottom: 1px solid ${theme.colors.grayLight};
  background: ${theme.colors.white};
  ${flexCenter};

  font-size: 14px;
  min-height: 48px;
  margin-bottom: 20px;
  span {
    margin-left: auto;
    margin-right: auto;
  }
  ${media.tablet`
    margin-bottom: 50px;
  `};
`;

const Button = styled.button`
  background: transparent;
  border: none;
  padding: 10px;
  position: absolute;
  right: 0;
  color: ${theme.colors.dark};
`;

type Props = {
  onRequestClose(): void,
  currentChapter: number,
  totalChapters: number
};

const Toolbar = (props: Props) => (
  <Div>
    <span>
      {props.currentChapter} / {props.totalChapters}
    </span>
    <Button onClick={props.onRequestClose} type="button">
      <MdClose />{' '}
      <SrOnly>
        <Trans>Close book</Trans>
      </SrOnly>
    </Button>
  </Div>
);

export { Toolbar as default, Button };
