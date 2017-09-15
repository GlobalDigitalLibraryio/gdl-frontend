// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Manager, Target, Popper } from 'react-popper';
import Downshift from 'downshift';
import { MdFileDownload } from 'react-icons/lib/md';
import Flex from '../components/Flex';
import Card, {
  CardAction,
  CardDropdown,
  CardDropdownItem,
} from '../components/Card';
import Heading from '../components/Heading';

/* eslint-disable jsx-a11y/href-no-hash */
// We use dummy links for example. So disable this rule

storiesOf('Card', module)
  .add('Simple card', () => <Card>This is a card</Card>)
  .add('Card as a grid', () => (
    <Flex wrap>
      <Card w={[1, 1 / 2]}>
        <CardAction>Test</CardAction>
        <hr />
        This book is available in 3 other languages
      </Card>
      <Card w={[1, 1 / 2]}>
        <CardAction>Download book</CardAction>
      </Card>
      <Card w={[1, 1 / 2]}>
        <CardAction>Translate book</CardAction>
      </Card>
      <Card fontSize={[12, 14]} w={[1, 1 / 2]}>
        <Heading>Published</Heading>
        31/12/2017
      </Card>
    </Flex>
  ))
  .add('Card with dropdown', () => (
    <Manager>
      <Downshift>
        {({ getButtonProps, getRootProps, isOpen }) => (
          <Card {...getRootProps({ refKey: 'innerRef' })}>
            <Target>
              <CardAction
                aria-haspopup
                aria-expanded
                {...getButtonProps()}
                href=""
                role="button"
              >
                Download book
              </CardAction>
            </Target>
            {isOpen && (
              <Popper placement="bottom" style={{ width: '100%' }}>
                <CardDropdown>
                  <CardDropdownItem href="#">
                    <MdFileDownload /> Download ePub
                  </CardDropdownItem>
                  <CardDropdownItem href="#">
                    <MdFileDownload /> Download PDF
                  </CardDropdownItem>
                </CardDropdown>
              </Popper>
            )}
          </Card>
        )}
      </Downshift>
    </Manager>
  ));
