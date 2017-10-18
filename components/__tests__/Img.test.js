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
import 'jest-styled-components';
import Img from '../Img';

test('Renders', () => {
  // src here is a 1x1 black gif
  const tree = mount(
    <Img
      alt="test"
      src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
    />,
  );

  expect(toJson(tree)).toMatchSnapshot();
});
