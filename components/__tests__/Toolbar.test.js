// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { ThemeProvider } from 'styled-components';
import { mount } from 'enzyme';
import type { Language } from '../../types';
import { ToolbarItem, ToolbarDropdownItem } from '../Toolbar';
import { theme } from '../../hocs/withTheme';

const languages: Array<Language> = [
  { code: 'ahm', name: 'Amharic' },
  { code: 'ben', name: 'Bengali' },
  { code: 'eng', name: 'English' },
];

let tree;

// Make sure we unmount after each test so everything is reset
afterEach(() => {
  tree.unmount();
});

test('Displays items when open', () => {
  tree = mount(
    <ThemeProvider theme={theme}>
      <ToolbarItem id="langFilter" text="Language" selectedItem="eng">
        {({ getItemProps, selectedItem, highlightedIndex }) =>
          languages.map((lang, index) => (
            <ToolbarDropdownItem
              key={lang.code}
              {...getItemProps({ item: lang.code })}
              isActive={highlightedIndex === index}
              isSelected={selectedItem === lang.code}
            >
              {lang.name}
            </ToolbarDropdownItem>
          ))}
      </ToolbarItem>
    </ThemeProvider>,
  );

  // Before we've trigged the dropdown, we shouldn't display any elements
  expect(tree.find(ToolbarDropdownItem)).toHaveLength(0);

  tree.find('a').simulate('click');

  expect(tree.find(ToolbarDropdownItem)).toHaveLength(languages.length);
});
