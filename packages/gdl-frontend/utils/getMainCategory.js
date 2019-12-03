// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */

/**
 * Currently, we have divided our application into main categories e.g books, games
 * During navigation, we want to know the current category so we use a Context to store the state
 * The state is corresponding to the available route name here so if new category are added,
 * it needs to follow the same routing pattern in routes.js and MainCategory in types.js
 */

import type { MainCategory } from '../types';

export function getMainCategory(path: string): MainCategory {
  if (path.startsWith('/books')) return 'books';
  if (path.startsWith('/games')) return 'games';

  // fallback to books on any random links
  return 'books';
}
