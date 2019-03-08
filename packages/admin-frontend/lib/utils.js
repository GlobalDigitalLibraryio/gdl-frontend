/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2019 GDL
 *
 * See LICENSE
 */
export default function formatMostReadDataToObjects(mostReadRes) {
  /**
   * The data comes as plan text or csv format which is comma separated
   * 1. We split on \n
   * 2. We remove the header, which is the first element in the array
   * 3. We return the formatted object values
   */
  mostReadRes.data = mostReadRes.data
    .split('\n')
    .slice(1)
    .map(item => {
      return {
        count: item.substr(0, item.indexOf(',')),
        title: item.substr(item.indexOf(',') + 1)
      };
    });
  return mostReadRes;
}
