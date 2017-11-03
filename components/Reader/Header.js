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
  display: flex;
  color: ${props => props.theme.grays.jumbo};
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
  color: ${props => props.theme.grays.dark};
`;

type Props = {
  onRequestClose(): void,
};

const Header = (props: Props) => (
  <Div>
    <Button onClick={props.onRequestClose}>
      <MdBackspace /> <Trans>Close book</Trans>
    </Button>
  </Div>
);

export { Header as default, Button };
