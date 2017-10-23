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
import H3 from '../H3';

test('Renders', () => {
  const tree = shallow(<H3>Header 3</H3>);

  expect(toJson(tree)).toMatchSnapshot();
});
