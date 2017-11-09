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

// About the global digital library
routes.add(
  'global-digital-library',
  'about/global-digital-library',
  'about/global-digital-library',
);

// Locking down all other sites except the two about pages in PROD
if (env.IS_PROD) {
  routes.add('about', '/', 'about/index');
} else {
  routes.add('about');
  // in other environments we want the books page to be the landing page
  routes.add('books', '/:lang?', 'index');
  // Book grid by level (we only allow a single digit for level, so no + in the regex)
  routes.add('level', '/:lang/books/level:level(\\d)', 'books/more');
  // Book grid for new books
  routes.add('new', '/:lang/books/new', 'books/more');

  // Book page
  routes.add('book', '/:lang/books/:id(\\d+)/:chapter(\\d+)?', 'books/index');
  routes.add('bookByNew', '/:lang/books/new/:id(\\d+)', 'books/index');
  // We only allow a single digit in the level, so no + in the regex
  routes.add(
    'bookByLevel',
    '/:lang/books/level:level(\\d)/:id(\\d+)',
    'books/index',
  );
}

module.exports = routes;
