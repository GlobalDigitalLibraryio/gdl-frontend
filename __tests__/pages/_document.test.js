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
    '<script async="">\n' +
    '                (function(i,s,o,g,r,a,m){i[\'GoogleAnalyticsObject\']=r;i[r]=i[r]||function(){\n' +
    '                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\n' +
    '                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\n' +
    '                })(window,document,\'script\',\'//www.google-analytics.com/analytics.js\',\'ga\');\n' +
    '\n' +
    '                ga(\'create\', \'N/A\', \'auto\');\n' +
    '                ga(\'send\', \'pageview\');</script>'
  );
});
