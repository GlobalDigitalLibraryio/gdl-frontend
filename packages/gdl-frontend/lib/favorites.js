// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import lscache from 'lscache';

const FAVORITES_KEY = 'favorites';

// The old object format that we used to store for each favorite
type OldFav = { id: number, language: string };
const oldFavToId = (fav: OldFav) => `${fav.id}-${fav.language}`;

export function addFavorite(id: string) {
  // Make sure we don't add the same book multiple times
  if (!isFavorite(id)) {
    const favs = [id, ...getFavoritedBookIds()];
    setFavorites(favs);
  }
}

export function removeFavorite(id: string) {
  const favs = getFavoritedBookIds().filter(x => x !== id);
  setFavorites(favs);
}

export function isFavorite(id: string) {
  return getFavoritedBookIds().includes(id);
}

export function getFavoritedBookIds(): Array<string> {
  const favorites: Array<string | OldFav> = lscache.get(FAVORITES_KEY) || [];

  /**
   * In the old days the favorites were objects instead of strings.
   * We should probably keep this for quite some time to ensure we don't screw up peoples favorites
   */
  if (favorites[0] && typeof favorites[0] !== 'string') {
    // $FlowFixMe: This is okay, we are transforming old data 8)
    setFavorites(favorites.map(oldFavToId));
    return getFavoritedBookIds();
  }

  // $FlowFixMe: This is okay, we have transformed old data here 8)
  return favorites;
}

export function clearFavorites() {
  lscache.remove(FAVORITES_KEY);
}

function setFavorites(ids: Array<string>) {
  lscache.set(FAVORITES_KEY, ids);
}
