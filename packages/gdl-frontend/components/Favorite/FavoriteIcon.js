// @flow
import React from 'react';
import { Favorite, FavoriteBorder } from '@material-ui/icons';

export default function FavoriteIcon({
  filled,
  ...props
}: {
  filled?: boolean
}) {
  return filled ? (
    <Favorite style={{ color: 'red' }} {...props} />
  ) : (
    <FavoriteBorder {...props} />
  );
}
