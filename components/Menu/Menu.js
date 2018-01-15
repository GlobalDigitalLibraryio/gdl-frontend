// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import Container from './Container';
import Backdrop from './Backdrop';
import KeyDown from '../KeyDown';
import ModalCard from './ModalCard';

type Props = {
  onCloseRequested(): void,
  children: React.Node
};

const Menu = ({ onCloseRequested, children }: Props) => (
  <Backdrop onClick={onCloseRequested}>
    <Container size="large">
      <ModalCard>
        <KeyDown when="Escape" then={onCloseRequested} />
        {children}
      </ModalCard>
    </Container>
  </Backdrop>
);

export default Menu;
