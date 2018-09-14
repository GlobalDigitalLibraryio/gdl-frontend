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
import getPageContext from '../../getPageContext';

test("Sets global GDL environment variable, defaults to 'dev'", () => {
  const tree = shallow(<Document pageContext={getPageContext()} />);
  expect(
    tree
      .find('script')
      .first()
      .html()
  ).toEqual(
    expect.stringContaining("<script>window.__GDL_ENVIRONMENT__ = 'dev';")
  );
});

test('Has the no robots meta tag', async () => {
  const tree = shallow(<Document pageContext={getPageContext()} />);
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
