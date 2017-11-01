// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import { shallow } from 'enzyme';
import * as React from 'react';
import Document from '../../pages/_document';

test('Sets global GDL environment variable, defaults to \'test\'', () => {
  const tree = shallow(<Document />);
  expect(tree.find('script').html()).toEqual(
    '<script>window.GDL_ENVIRONMENT = \'test\'</script>',
  );
});
