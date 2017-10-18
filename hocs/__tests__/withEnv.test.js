// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import withEnv from '../withEnv';

beforeAll(() => {
  process.env.GDL_ENVIRONMENT = 'unittest';
});

afterAll(() => {
  delete process.env.GDL_ENVIRONMENT;
});

test('HoC composes and adds env prop', async () => {
  const Page = () => <div>Test</div>;
  Page.getInitialProps = () => ({ intact: 'prop' });

  const withHoc = withEnv(Page);

  expect(await withHoc.getInitialProps()).toEqual(
    expect.objectContaining({
      env: {
        GDL_ENVIRONMENT: 'unittest',
      },
      intact: 'prop',
    }),
  );
});
