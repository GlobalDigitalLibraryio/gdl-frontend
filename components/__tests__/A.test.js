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
import A from '../A';

expect.addSnapshotSerializer(createSerializer(emotion))

test('Is underlined anchor', () => {
  const tree = shallow(<A>Link</A>);

  expect(toJson(tree)).toMatchSnapshot();
});
