// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as Sentry from '@sentry/browser';
import getConfig from 'next/config';
import { GDL_ENVIRONMENT } from 'gdl-config';
import type { ConfigShape } from '../types';

const {
  publicRuntimeConfig: { SENTRY_PROJECT_ID, SENTRY_PUBLIC_KEY, REPORT_ERRORS }
}: ConfigShape = getConfig();

export default function() {
  if (process.env.NODE_ENV === 'production' && REPORT_ERRORS) {
    Sentry.init({
      release: '5612c7e633c828ed4dc7b1b4cbab9f37d5ecc73f',
      dsn: `https://${SENTRY_PUBLIC_KEY}@sentry.io/${SENTRY_PROJECT_ID}`,
      environment: GDL_ENVIRONMENT
    });
  }
}
