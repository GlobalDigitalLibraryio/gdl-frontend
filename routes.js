// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 * 
 * See LICENSE
 */
const nextRoutes = require('next-routes');
const env = require('./env');

const routes = nextRoutes();

if (env.IS_PROD) {
  // In prod we want the about page to the landing page
  routes.add('about', '/', 'about/index');
  routes.add('books', '/books', 'index');
} else {
  // in other environments we want the books page to be the landing page
  routes.add('books', '/', 'index');
  routes.add('about');
}

// Book grid by level
routes.add('level', '/books/:lang/level:level(\\d+)', 'books/more');
// Book grid for new books
routes.add('new', '/books/:lang/new', 'books/more');

// Book page
routes.add('book', '/books/:lang/:id(\\d+)/:chapter(\\d+)?', 'books/index');

// About the global digital library
routes.add(
  'global-digital-library',
  'about/global-digital-library',
  'about/global-digital-library',
);

module.exports = routes;
