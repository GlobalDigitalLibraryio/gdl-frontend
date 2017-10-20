// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import 'jest-styled-components';
import P from '../P';

test('Responsive font sizes', () => {
  const tree = shallow(<P fontSize={[15, 20]}>Responsive font size</P>);

  expect(toJson(tree)).toMatchSnapshot();
});

test('Responsive line heights', () => {
  const tree = shallow(<P lineHeight={[15, 20]}>Responsive font size</P>);

  expect(toJson(tree)).toMatchSnapshot();
});
