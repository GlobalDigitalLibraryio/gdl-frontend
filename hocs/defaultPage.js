// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

import * as React from 'react';
import withEnv from './withEnv';
import withI18n from './withI18n';
import withTheme from './withTheme';

/**
 * Small HoC that combines all necessary pages wrapper so we get a single point of entry
 */
export default (Page: React.ComponentType<any>) =>
  withTheme(withEnv(withI18n(Page)));
