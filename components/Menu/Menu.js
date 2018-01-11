// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import type { Language } from '../../types';
import Container from './Container';
import Backdrop from './Backdrop';
import KeyDown from '../KeyDown';
import ModalCard from './ModalCard';

type Props = {
  onCloseRequested(): void
};

type State = {
  languages: Array<Language>,
  levels: Array<string>
};

class Menu extends React.Component<Props, State> {
  render() {
    return (
      <Backdrop onClick={this.props.onCloseRequested}>
        <Container size="large">
          <ModalCard>
            <KeyDown when="Escape" then={this.props.onCloseRequested} />
            {this.props.children}
          </ModalCard>
        </Container>
      </Backdrop>
    );
  }
}

export default Menu;
