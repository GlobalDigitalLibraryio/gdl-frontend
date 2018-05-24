// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { mount } from 'enzyme';
import KeyDown from '../KeyDown';

const mockCallback = jest.fn();
const event = new KeyboardEvent('keydown', { key: 'x' });
let tree;

// Make sure we clear our mock after each run so the counter is reset
afterEach(() => {
  tree.unmount();
  mockCallback.mockClear();
});

test('Calls our function when key press matches', () => {
  tree = mount(<KeyDown when={event.key} then={mockCallback} />);
  document.dispatchEvent(event);
  expect(mockCallback).toHaveBeenCalledTimes(1);
});

test('Does not call when different key is pressed', () => {
  // The "when" here does not match the key of the event
  tree = mount(<KeyDown when="Escape" then={mockCallback} />);
  document.dispatchEvent(event);
  expect(mockCallback).toHaveBeenCalledTimes(0);
});

test('Does not call when disabled', () => {
  tree = mount(<KeyDown when={event.key} then={mockCallback} disabled />);
  document.dispatchEvent(event);
  expect(mockCallback).toHaveBeenCalledTimes(0);
});
