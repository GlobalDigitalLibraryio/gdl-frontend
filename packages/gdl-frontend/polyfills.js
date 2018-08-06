// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import { FeaturePolyfills } from '@engineerapart/nextscript';

/**
 * These are the polyfills needed to at least render the site in IE11, even though it looks fugly.
 * The Intl polyfill is needed by iOS9
 *
 * We use feature detection so the clients only load the polyfills they really need.
 * Also the polyfills are loaded before our application.
 *
 * See https://github.com/engineerapart/nextscript
 */
export default [
  FeaturePolyfills.ARRAY_FIND,
  FeaturePolyfills.ARRAY_INCLUDES,
  FeaturePolyfills.OBJECT_ASSIGN,
  {
    test: `('Intl' in window)`,
    feature: 'Intl.~locale.en'
  },
  {
    test: `('includes' in String.prototype)`,
    feature: 'String.prototype.includes'
  },
  {
    test: `('values' in Object)`,
    feature: 'Object.values'
  },
  {
    test: `('entries' in Object)`,
    feature: 'Object.entries'
  }
];
