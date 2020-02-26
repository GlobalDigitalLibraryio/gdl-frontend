// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */
const nextRoutes = require('next-routes');

const routes = nextRoutes();

// For the language parameter, match any combination of alphanumeric and - (Poor man's BCP47 matching!)
const langParam = `:lang([\\w-]+)`;

/**
 * Currently, we have divided our application into main categories e.g books, games
 * During navigation, we want to know the current category so we use a Context to store the state
 * The state is corresponding to the available route name here so if new category are added,
 * it needs to follow the same pattern with /utils/getMainCategory.js and MainCategory in types.js
 */

routes.add(
  'translate',
  `/${langParam}/books/translate/:id(\\d+)`,
  'books/_translate'
);
routes.add(
  'translateEdit',
  `/${langParam}/books/translate/:id(\\d+)/:toLang([\\w-]+)/edit/:chapterId(\\d+)?`,
  'books/_translate_edit'
);

routes.add({
  name: 'translations',
  pattern: '/books/translations',
  page: '/books/translations'
});
routes.add('login');
routes.add('logout');
routes.add('search');
routes.add('favorites');
routes.add('offline');

// in other environments we want the books page to be the landing page
routes.add('books', `/${langParam}?`, 'index');
routes.add('classroom', `/${langParam}/books/category/classroom`, 'index');
routes.add('library', `/${langParam}/books/category/library`, 'index');

// Browse the books
routes.add('browseBooks', `/${langParam}/books/browse`, 'books/browse');

// Book details page
routes.add('book', `/${langParam}/books/details/:id(\\d+)`, 'books/_book');

// Video landing page
routes.add('videos', `/${langParam}/videos`, 'videos/index');

// Game landing page
routes.add('games', `/${langParam}/games`, 'games/index');

// Game details page
routes.add('game', `/${langParam}/games/details/:id`, 'games/_game');

// Play H5P games
routes.add('play', `/${langParam}/games/play/:id`, 'games/_play');

// Read book
routes.add(
  'read',
  `/${langParam}/books/read/:id(\\d+)/:chapterId(\\d+)?`,
  'books/_read'
);

module.exports = routes;
