// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
const nextRoutes = require('next-routes');
const config = require('./config');

const routes = nextRoutes();

// About the global digital library
routes.add(
  'global-digital-library',
  'about/global-digital-library',
  'about/global-digital-library'
);

// Locking down all other sites except the two about pages in PROD
if (config.STATIC_PAGES_ONLY) {
  routes.add('about', '/', 'about');
} else {
  // Translate book
  if (config.TRANSLATION_PAGES) {
    routes.add(
      'translate',
      '/:lang/books/translate/:id(\\d+)',
      'books/_translate'
    );
    routes.add({
      name: 'translations',
      pattern: '/books/translations',
      page: '/books/translations'
    });
  }
  routes.add('about');
  routes.add('login');
  routes.add('logout');
  routes.add('search', '/:lang/search', '_search');
  // in other environments we want the books page to be the landing page
  routes.add('books', '/:lang?', 'index');
  // Book grid by level (we only allow a single digit for level, so no + in the regex)
  routes.add('level', '/:lang/books/level:level(\\d)', 'books/browse');
  // Book grid for new books
  routes.add('new', '/:lang/books/new', 'books/browse');

  // Book details page
  routes.add('book', '/:lang/books/details/:id(\\d+)', 'books/_book');

  // Read book
  routes.add(
    'read',
    '/:lang/books/read/:id(\\d+)/:chapter(\\d+)?',
    'books/read'
  );
}

module.exports = routes;
