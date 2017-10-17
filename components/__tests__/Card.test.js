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
import Card from '../Card';

test('Renders', () => {
  const tree = shallow(<Card theme={theme}>I am in a card!</Card>);

  expect(toJson(tree)).toMatchSnapshot();
});
