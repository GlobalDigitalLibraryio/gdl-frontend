// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React from 'react';
import serializer from 'jest-emotion';
import SrOnly from '../SrOnly';
import renderer from 'react-test-renderer';

// $FlowFixMe flow type is not correct for serializer
expect.addSnapshotSerializer(serializer);

test('Renders', () => {
  const tree = renderer.create(<SrOnly>Screen reader only</SrOnly>).toJSON();

  expect(tree).toMatchSnapshot();
});
