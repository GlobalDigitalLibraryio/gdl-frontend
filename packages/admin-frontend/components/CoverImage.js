// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import Image from './Image';
import { TABLET_BREAKPOINT } from '../style/misc';

const NO_COVER_PLACEHOLDER_URL = require('../placeholder-cover.png');

// To prevent downloading the same covers again again with small differences
// Set the "biggest" size for each viewport here.
const COVER_WIDTHS = [130, 260];

// Desktop size: 115 x 155
// Mobile size: 80 x 108

type Props = {
  ariaHidden: boolean,
  src: ?string,
  w: Array<string | number>,
  h: Array<string | number>
};

const srcUrl = (src, width) =>
  `${src}?storedRatio=0.81&focalX=50&focalY=50&ratio=0.81&width=${width}`;

/** Generate srcset value for two different pixels densities */
function srcSet(url: string, width: number) {
  // Note: 1x descriptior is assumed when left out
  return `${srcUrl(url, width)}, ${srcUrl(url, width * 2)} 2x`;
}

/**
 * Add query parameters to book cover images so they fit our wanted ratio
 * This also means we don't download the full image, just the part we want
 */
const CoverImage = ({ src, ariaHidden, ...props }: Props) => {
  const srcOrPlaceholder =
    (src && srcUrl(src, COVER_WIDTHS[1])) || NO_COVER_PLACEHOLDER_URL;

  if (src == null) {
    return (
      <Image
        ariaHidden={ariaHidden}
        src={NO_COVER_PLACEHOLDER_URL}
        {...props}
      />
    );
  }

  return (
    <Image
      ariaHidden={ariaHidden}
      srcSet={srcSet(src, COVER_WIDTHS[0])}
      src={srcOrPlaceholder}
      {...props}
    >
      <source
        media={`(min-width: ${TABLET_BREAKPOINT}px)`}
        srcSet={srcSet(src, COVER_WIDTHS[1])}
      />
    </Image>
  );
};

export default CoverImage;
