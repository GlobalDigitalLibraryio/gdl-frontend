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
  expect(tree.find('script').at(0).html()).toEqual(
    '<script>window.__GDL_ENVIRONMENT__ = \'test\';</script>',
  );
});

test('Adds Google Analytics, defaults to \'N/A\' because we don\'t have an account at Google for env=local' , () => {
  const tree = shallow(<Document />);
  expect(tree.find('script').at(1).html()).toEqual(
    '<script>window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;ga(\'create\', \'N/A\', \'auto\');ga(\'send\', \'pageview\');</script>'
  );
});
