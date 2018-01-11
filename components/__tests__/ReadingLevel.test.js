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
import { createSerializer } from 'jest-emotion';
import * as emotion from 'emotion';
import ReadingLevel from '../ReadingLevel';

expect.addSnapshotSerializer(createSerializer(emotion));

test('Renders', () => {
  const tree = mount(<ReadingLevel level="1" />);

  expect(toJson(tree)).toMatchSnapshot();
});
