// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import 'jest-styled-components';
import Title from '../Title';

test('Renders a Title', () => {
  const tree = mount(<Title>Normal title</Title>);

  expect(toJson(tree)).toMatchSnapshot();
});

test('Supports uppercasing', () => {
  const tree = mount(<Title upperCase>Uppercased title</Title>);

  // Get the h1 node and check it if has the proper CSS rule
  expect(toJson(tree.find('h1'))).toHaveStyleRule(
    'text-transform',
    'uppercase',
  );
});
