// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { withI18n } from '@lingui/react';
import type { I18n as I18nType } from '../types';

/**
 * Turn the withI18n HoC and turns into a render prop/children as a function component
 * Renders props aren't so destructive to Flow as HoCs...
 */
const I18n = withI18n()(
  ({
    i18n,
    children
  }: {
    i18n: I18nType,
    children: (data: { i18n: I18nType }) => React.Node
  }) => children({ i18n })
);

export default I18n;
