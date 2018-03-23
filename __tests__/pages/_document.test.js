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

test("Sets global GDL environment variable, defaults to 'test'", () => {
  const tree = shallow(<Document />);
  expect(
    tree
      .find('script')
      .first()
      .html()
  ).toEqual("<script>window.__GDL_ENVIRONMENT__ = 'test';</script>");
});

test('Has the no robots meta tag', () => {
  const tree = shallow(<Document />);
  expect(
    tree
      .find('meta')
      .filterWhere(
        meta =>
          meta.prop('name') === 'robots' &&
          meta.prop('content') === 'noindex, nofollow'
      )
      .exists()
  ).toBeTruthy();
});
