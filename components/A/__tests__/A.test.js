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
import A from '../';

expect.addSnapshotSerializer(createSerializer(emotion));

test('Is uppercased anchor', () => {
  const tree = shallow(
    <A isUppercased href="http://test.com">
      Link
    </A>
  );

  expect(toJson(tree)).toMatchSnapshot();
});

test('Is bold anchor', () => {
  const tree = shallow(
    <A isBold href="http://test.com">
      Link
    </A>
  );

  expect(toJson(tree)).toMatchSnapshot();
});
