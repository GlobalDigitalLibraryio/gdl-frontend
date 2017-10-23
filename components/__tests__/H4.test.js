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
import H4 from '../H4';

test('Renders', () => {
  const tree = shallow(<H4>Header 4</H4>);

  expect(toJson(tree)).toMatchSnapshot();
});
