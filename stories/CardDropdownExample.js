// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/lib/md';
import Card from '../components/Card';
import CardDropdown, { CardDropdownItem } from '../components/CardDropdown';
import Container from '../components/Container';

const languages = [
  { code: 'ahm', name: 'Amharic' },
  { code: 'ben', name: 'Bengali' },
  { code: 'eng', name: 'English' },
];

storiesOf('CardDropdown', module)
  .addDecorator(story => <Container>{story()}</Container>)
  .add('Card with dropdown', () => (
    <Card>
      <CardDropdown
        id="dropdowntest"
        renderTarget={(getTargetProps, isOpen) => (
          <a {...getTargetProps()}>
            Test {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </a>
        )}
      >
        {({ getItemProps, highlightedIndex }) =>
          languages.map((lang, index) => (
            <CardDropdownItem
              key={lang.code}
              {...getItemProps({ item: lang.code })}
              isActive={highlightedIndex === index}
            >
              {lang.name}
            </CardDropdownItem>
          ))}
      </CardDropdown>
    </Card>
  ));
