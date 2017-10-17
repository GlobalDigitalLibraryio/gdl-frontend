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
import { theme } from '../../hocs/withTheme';
import ReadingLevel from '../ReadingLevel';

test('Renders', () => {
  const tree = shallow(<ReadingLevel theme={theme}>Level 1</ReadingLevel>);

  expect(toJson(tree)).toMatchSnapshot();
});
