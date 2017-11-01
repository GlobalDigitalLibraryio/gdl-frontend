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

routes.add('book', '/books/:lang/:id(\\d+)/:chapter(\\d+)?', 'books/index');
routes.add(
  'global-digital-library',
  'about/global-digital-library',
  'about/global-digital-library',
);

module.exports = routes;
