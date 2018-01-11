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
import Box from '../Box';

expect.addSnapshotSerializer(createSerializer(emotion));

test('Can have different paddings', () => {
  let tree = mount(<Box p={10} />);
  expect(toJson(tree)).toMatchSnapshot();

  tree = mount(<Box px={5} py={10} />);
  expect(toJson(tree)).toMatchSnapshot();

  tree = mount(<Box pb="1px" pl="2px" pt="3px" pr="4px" />);
  expect(toJson(tree)).toMatchSnapshot();
});

test('Can have different margins', () => {
  let tree = mount(<Box m={10} />);
  expect(toJson(tree)).toMatchSnapshot();

  tree = mount(<Box mx={5} my={10} />);
  expect(toJson(tree)).toMatchSnapshot();

  tree = mount(<Box mb="1px" ml="2px" mt="3px" mr="4px" />);
  expect(toJson(tree)).toMatchSnapshot();
});
