// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import lscache from 'lscache';
import type { Book } from '../types';

const FAVORITES_KEY = 'favorites';

export function markFavorite(book: Book) {
  const favs = [...getFavorites(), { id: book.id, lang: book.language.code }];
  setFavorites(favs);
}

export function removeFavorite(book: Book) {
  const favs = getFavorites().filter(
    fav => fav.id === book.id && fav.lang === book.language.code
  );
  setFavorites(favs);
}

export function getFavorites(): Array<string> {
  return lscache.get(FAVORITES_KEY) || [];
}

function setFavorites(favs) {
  lscache.set(FAVORITES_KEY, favs);
}
