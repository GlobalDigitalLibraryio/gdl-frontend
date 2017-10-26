// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import { Error } from '../../pages/_error';

test('Returns statusCode from res (server)', async () => {
  expect(await Error.getInitialProps({ res: { statusCode: 404 } })).toEqual(
    expect.objectContaining({
      statusCode: 404,
    }),
  );
});

test('Returns statusCode from jsonPageRes (client)', async () => {
  expect(await Error.getInitialProps({ jsonPageRes: { status: 418 } })).toEqual(
    expect.objectContaining({
      statusCode: 418,
    }),
  );
});
