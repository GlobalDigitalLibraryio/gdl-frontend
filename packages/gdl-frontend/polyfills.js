/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

/* eslint no-extend-native: 0 */
// core-js comes with Next.js. So, you can import it like below
import includes from 'core-js/library/fn/string/virtual/includes';
import startsWith from 'core-js/library/fn/string/virtual/starts-with';
import assign from 'core-js/library/fn/object/assign';
import entries from 'core-js/library/fn/object/entries';
import values from 'core-js/library/fn/object/values';
import find from 'core-js/library/fn/array/find';
import fromArray from 'core-js/library/fn/array/from';
import includesArray from 'core-js/library/fn/array/includes';

String.prototype.includes = includes;
String.prototype.startsWith = startsWith;
Object.assign = assign;
Object.entries = entries;
Object.values = values;
Array.find = find;
Array.from = fromArray;
Array.includes = includesArray;
