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

// For the language parameter, match any combination of alphanumeric and - (Poor man's BCP47 matching!)
const langParam = `:lang([\\w-]+)`;

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
      `/${langParam}/books/translate/:id(\\d+)`,
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
  routes.add('search', `/${langParam}/search`, '_search');

  // in other environments we want the books page to be the landing page
  routes.add('books', `/${langParam}?`, 'index');
  routes.add('classroom', `/${langParam}/books/category/classroom`, 'index');
  routes.add('library', `/${langParam}/books/category/library`, 'index');

  // Browse the books
  routes.add('browse', `/${langParam}/books/browse`, 'books/browse');

  // Book details page
  routes.add('book', `/${langParam}/books/details/:id(\\d+)`, 'books/_book');

  // Read book
  routes.add(
    'read',
    `/${langParam}/books/read/:id(\\d+)/:chapter(\\d+)?`,
    'books/read'
  );
}

module.exports = routes;
