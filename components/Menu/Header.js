// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import React, { type Element } from 'react';
import MdClose from 'react-icons/lib/md/close';
import MdArrowBack from 'react-icons/lib/md/arrow-back';
import { Trans } from '@lingui/react';

import { Header, Title, Button } from './styled/Content';
import SrOnly from '../SrOnly';

type Props = {
  /** The menu title; rendered in the header. */
  heading: string | Element<'Trans'>,
  /** Will display a 'back' button instead of a close button in the header */
  isNestedMenu?: boolean,
  /**
    Function that will be called to initiate the exit transition.
  */
  onClose: (
    event: SyntheticMouseEvent<any> | SyntheticKeyboardEvent<any>
  ) => void
};

// Tiny trick to align title with button. Used to "push" element
const JustifyShim = () => <span aria-hidden style={{ width: '24px' }} />;

const ModalHeader = ({ heading, isNestedMenu, onClose }: Props) => (
  <Header>
    {isNestedMenu ? (
      <Button type="button" onClick={onClose}>
        <MdArrowBack aria-hidden />
        <SrOnly>
          <Trans>Close menu</Trans>
        </SrOnly>
      </Button>
    ) : (
      <JustifyShim />
    )}

    <Title>{heading}</Title>

    {!isNestedMenu ? (
      <Button type="button" onClick={onClose}>
        <MdClose aria-hidden />
        <SrOnly>
          <Trans>Close menu</Trans>
        </SrOnly>
      </Button>
    ) : (
      <JustifyShim />
    )}
  </Header>
);

export default ModalHeader;
