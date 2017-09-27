// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { MdCheck } from 'react-icons/lib/md';
import Toolbar, {
  ToolbarItem,
  ToolbarDropdownItem,
} from '../components/Toolbar';
import type { Language } from '../types';
import Container from '../components/Container';

const languages: Array<Language> = [
  { code: 'ahm', name: 'Amharic' },
  { code: 'ben', name: 'Bengali' },
  { code: 'eng', name: 'English' },
];

const levels = ['1', '2', '3'];

storiesOf('Toolbar', module).add('Toolbar', () => (
  <Toolbar>
    <Container>
      <ToolbarItem id="langFilter" text="Language" selectedItem="eng">
        {({ getItemProps, selectedItem, highlightedIndex }) =>
          languages.map((lang, index) => (
            <ToolbarDropdownItem
              key={lang.code}
              {...getItemProps({ item: lang.code })}
              isActive={highlightedIndex === index}
              isSelected={selectedItem === lang.code}
            >
              <MdCheck />
              {lang.name}
            </ToolbarDropdownItem>
          ))}
      </ToolbarItem>

      <ToolbarItem id="levelFilter" text="Level" selectedItem={null}>
        {({ getItemProps, highlightedIndex }) =>
          levels.map((level, index) => (
            <ToolbarDropdownItem
              key={level}
              {...getItemProps({ item: level })}
              isActive={highlightedIndex === index}
            >
              <MdCheck />
              Level {level}
            </ToolbarDropdownItem>
          ))}
      </ToolbarItem>
    </Container>
  </Toolbar>
));
