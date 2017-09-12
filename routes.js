/**
 * Copyright (c) 2017-present, Global Digital Library.
 * 
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 */

// @flow
const nextRoutes = require('next-routes');

const routes = nextRoutes();
module.exports = routes;

routes.add('book', '/books/:id(\\d+)', 'books/_book');
