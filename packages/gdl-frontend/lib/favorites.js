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
type Fav = { id: number, lang: string };

export function markAsFavorite(book: Book) {
  const favs = [...getFavorites(), { id: book.id, lang: book.language.code }];
  setFavorites(favs);
}

export function removeAsFavorite(book: Book) {
  const favs = getFavorites().filter(
    fav => !(fav.id === book.id && fav.lang === book.language.code)
  );
  setFavorites(favs);
}

export function isFavorite(book: Book) {
  const favs = getFavorites();
  return Boolean(
    favs.find(f => f.id === book.id && f.lang === book.language.code)
  );
}

export function getFavorites(): Array<Fav> {
  return lscache.get(FAVORITES_KEY) || [];
}

function setFavorites(favs) {
  lscache.set(FAVORITES_KEY, favs);
}
