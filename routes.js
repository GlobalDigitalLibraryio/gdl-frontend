// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */

const nextRoutes = require('next-routes');

const routes = nextRoutes();
module.exports = routes;

routes.add('book', '/books/:id(\\d+)', 'books/_book');
