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
import { createSerializer } from 'jest-emotion';
import * as emotion from 'emotion';
import H6 from '../H6';

expect.addSnapshotSerializer(createSerializer(emotion));

test('Renders', () => {
  const tree = shallow(<H6>Header 6</H6>);

  expect(toJson(tree)).toMatchSnapshot();
});
