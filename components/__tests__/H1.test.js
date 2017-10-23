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
import H1 from '../H1';

test('Renders', () => {
  const tree = shallow(<H1>Header 1</H1>);

  expect(toJson(tree)).toMatchSnapshot();
});
