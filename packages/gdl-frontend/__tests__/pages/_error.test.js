// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import Error from '../../pages/_error';

jest.mock('next/config', () => {
  return function() {
    return {
      publicRuntimeConfig: {},
      serverRuntimeConfig: {}
    };
  };
});

test('Returns statusCode from res (server)', async () => {
  expect(
    // $FlowFixMe: Ignore not sending context obj
    Error.getInitialProps({ res: { statusCode: 404 } })
  ).toEqual(
    expect.objectContaining({
      statusCode: 404
    })
  );
});

test('Returns statusCode from err (client)', async () => {
  expect(
    // $FlowFixMe: Ignore not sending context obj
    Error.getInitialProps({
      err: { statusCode: 418 }
    })
  ).toEqual(
    expect.objectContaining({
      statusCode: 418
    })
  );
});
