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
import H6 from '../H6';

test('Renders', () => {
  const tree = shallow(<H6>Header 6</H6>);

  expect(toJson(tree)).toMatchSnapshot();
});
