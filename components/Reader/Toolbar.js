// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import styled from 'styled-components';
import { Trans } from 'lingui-react';
import { MdBackspace } from 'react-icons/lib/md';
import media from '../helpers/media';

const Div = styled.div`
  display: ${p => (p.showOnMobile ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  ${media.tablet`
    display: flex;
    position: sticky;
  `} color: ${props => props.theme.grays.jumbo};
  background-color: ${props => props.theme.grays.desertStorm};
  border-bottom: 1px solid ${props => props.theme.grays.platinum};

  font-size: 14px;
  min-height: 48px;
  ${media.tablet`
    min-height: 48px;
    font-size: 16px;
  `};
`;

const Button = styled.button.attrs({
  type: 'button',
})`
  background: transparent;
  border-radius: 0;
  border: none;
  font-size: 14px;
  color: ${props => props.theme.grays.dark};
  :disabled {
    color: ${p => p.theme.grays.silverSand};
  }
`;

type Props = {
  showOnMobile: boolean,
  onRequestClose(): void,
};

const Toolbar = (props: Props) => (
  <Div showOnMobile={props.showOnMobile}>
    <Button onClick={props.onRequestClose}>
      <MdBackspace /> <Trans>Close book</Trans>
    </Button>
  </Div>
);

export { Toolbar as default, Button };
