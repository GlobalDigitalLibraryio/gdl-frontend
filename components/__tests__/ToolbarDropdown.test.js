// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { mount } from 'enzyme';
import Link from 'next/link';
import Router from 'next/router';
import type { Language } from '../../types';
import ToolbarItem, { ToolbarDropdownItem } from '../ToolbarDropdown';

const languages: Array<Language> = [
  { code: 'ahm', name: 'Amharic' },
  { code: 'ben', name: 'Bengali' },
  { code: 'eng', name: 'English' }
];

let tree;

// Make sure we unmount after each test so everything is reset
afterEach(() => {
  tree.unmount();
});

test('Displays items when open', () => {
  tree = mount(
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
        ))
      }
    </ToolbarItem>
  );

  // Before we've trigged the dropdown, we shouldn't display any elements
  expect(tree.find(ToolbarDropdownItem)).toHaveLength(0);

  tree.find('a').simulate('click');

  expect(tree.find(ToolbarDropdownItem)).toHaveLength(languages.length);
});

test('Closes the dropdown when selecting an item, even when wrapped with next Link', () => {
  // Mock out the router. See https://github.com/zeit/next.js/issues/1827#issuecomment-323314141
  const mockedRouter = { push: () => Promise.resolve(), prefetch: () => {} };
  Router.router = mockedRouter;

  tree = mount(
    <ToolbarItem id="langFilter" text="Language" selectedItem="eng">
      {({ getItemProps, selectedItem, highlightedIndex }) =>
        languages.map((lang, index) => (
          <Link href="test" passHref key={lang.code}>
            <ToolbarDropdownItem
              {...getItemProps({ item: lang.code })}
              isActive={highlightedIndex === index}
              isSelected={selectedItem === lang.code}
            >
              {lang.name}
            </ToolbarDropdownItem>
          </Link>
        ))
      }
    </ToolbarItem>
  );

  // Open the dropdown
  const dropdownButton = tree.find('a');
  dropdownButton.simulate('click');
  // Should be expanded now
  expect(dropdownButton.getDOMNode().getAttribute('aria-expanded')).toEqual(
    'true'
  );

  // Click an item in the dropdown
  tree
    .find(ToolbarDropdownItem)
    .first()
    .simulate('click');

  // The dropdown should now be closed
  expect(dropdownButton.getDOMNode().getAttribute('aria-expanded')).toEqual(
    'false'
  );
});
