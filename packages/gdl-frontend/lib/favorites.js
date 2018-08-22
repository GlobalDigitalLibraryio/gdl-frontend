// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import lscache from 'lscache';

const FAVORITES_KEY = 'favorites';
// The object format that we store for each favorite
type Fav = { id: number, language: string };

export function markAsFavorite(fav: Fav) {
  // Make sure we don't add the same book multiple times
  if (!isFavorite(fav)) {
    const favs = [{ id: fav.id, language: fav.language }, ...getFavorites()];
    setFavorites(favs);
  }
}

export function removeAsFavorite(fav: Fav) {
  const favs = getFavorites().filter(
    f => !(fav.id === f.id && fav.language === f.language)
  );
  setFavorites(favs);
}

export function isFavorite(fav: Fav) {
  const favs = getFavorites();
  return Boolean(
    favs.find(f => f.id === fav.id && f.language === fav.language)
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
