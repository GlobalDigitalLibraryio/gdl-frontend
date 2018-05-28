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
import SrOnly from '../SrOnly';

expect.addSnapshotSerializer(createSerializer(emotion));

test('Renders', () => {
  const tree = shallow(<SrOnly>Screen reader only</SrOnly>);

  expect(toJson(tree)).toMatchSnapshot();
});
