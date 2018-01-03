// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import type { Language } from '../../types';
import Container from '../Container';
import Backdrop from './Backdrop';
import KeyDown from '../KeyDown';
import Card from '../Card';

type Props = {
  onCloseRequested(): void,
};

type State = {
  languages: Array<Language>,
  levels: Array<string>,
};


class Menu extends React.Component<Props, State> {

  render() {

    return (
      <Backdrop onClick={this.props.onCloseRequested}>
        <Container
          size="large"
          style={{ height: '100%', paddingLeft: 0, paddingRight: 0, overflowY: 'auto' }}
        >
          <Card>
            <KeyDown when="Escape" then={this.props.onCloseRequested} />
            {this.props.children}
          </Card>
        </Container>
      </Backdrop>
    );
  }
}

export default Menu;
