// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import lscache from 'lscache';
import type { BookDetails } from '../types';

const FAVORITES_KEY = 'favorites';
// The object format that we store for each favorite
type Fav = { id: number, language: string };

export function markAsFavorite(book: BookDetails) {
  // Make sure we don't add the same book multiple times
  if (!isFavorite(book)) {
    const favs = [
      { id: book.id, language: book.language.code },
      ...getFavorites()
    ];
    setFavorites(favs);
  }
}

/**
 * Supports both a full book object and a simple fav object
 */
export function removeAsFavorite(book: BookDetails | Fav) {
  const language =
    typeof book.language === 'string' ? book.language : book.language.code;

  const favs = getFavorites().filter(
    fav => !(fav.id === book.id && fav.language === language)
  );
  setFavorites(favs);
}

export function isFavorite(book: BookDetails) {
  const favs = getFavorites();
  return Boolean(
    favs.find(f => f.id === book.id && f.language === book.language.code)
  );
}

export function getFavorites(): Array<Fav> {
  return lscache.get(FAVORITES_KEY) || [];
}

export function clearFavorites() {
  lscache.remove(FAVORITES_KEY);
}

function setFavorites(favs) {
  lscache.set(FAVORITES_KEY, favs);
}
