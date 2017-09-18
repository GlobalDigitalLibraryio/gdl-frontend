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
import Card, {
  CardAction,
  CardDropdown,
  CardDropdownItem,
} from '../components/Card';
import Container from '../components/Container';

/* eslint-disable jsx-a11y/href-no-hash */
// We use dummy links for example. So disable this rule

// FIXME: Have to add wrapping div around Card for now
// because of https://github.com/jxnblk/grid-styled/issues/44

storiesOf('Card', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .add('Simple card', () => <Card>This is a card</Card>)
  .add('Card with dropdown', () => (
    <Manager>
      <Downshift>
        {({ getButtonProps, isOpen }) => (
          <div>
            <Card>
              <Target>
                <CardAction {...getButtonProps()} href="">
                  Download book
                </CardAction>
              </Target>
              {isOpen && (
                <Popper placement="bottom" style={{ width: '100%' }}>
                  <CardDropdown>
                    <CardDropdownItem href="http://www.vg.no">
                      <MdFileDownload /> Download ePub
                    </CardDropdownItem>
                    <CardDropdownItem href="http://www.dagbladet.no">
                      <MdFileDownload /> Download PDF
                    </CardDropdownItem>
                  </CardDropdown>
                </Popper>
              )}
            </Card>
          </div>
        )}
      </Downshift>
    </Manager>
  ));
