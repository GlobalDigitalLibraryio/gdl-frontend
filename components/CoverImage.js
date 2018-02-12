// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import Image from './Image';
import { TABLET_BREAKPOINT } from '../style/theme';

const NO_COVER_PLACEHOLDER_URL = require('../static/placeholder-cover.png');

type Props = {
  src: ?string,
  // The width of the image for mobile and => tablet
  width: [number, number]
};

const srcUrl = (src, width) =>
  `${src}?focalX=50&focalY=50&ratio=0.81&width=${width}`;

/** Generate srcset value for two different pixels densities */
function srcSet(url: string, width: number) {
  // Note: 1x descriptior is assumed when left out
  return `${srcUrl(url, width)}, ${srcUrl(url, width * 2)} 2x`;
}

/**
 * Add query parameters to book cover images so they fit our wanted ratio
 * This also means we don't download the full image, just the part we want
 */
const CoverImage = ({ src, width, ...props }: Props) => {
  const srcOrPlaceholder =
    (src && srcUrl(src, 260)) || NO_COVER_PLACEHOLDER_URL;

  if (src == null) {
    return <Image src={NO_COVER_PLACEHOLDER_URL} {...props} />;
  }

  return (
    <Image srcSet={srcSet(src, width[0])} src={srcOrPlaceholder} {...props}>
      <source
        media={`(min-width: ${TABLET_BREAKPOINT}px)`}
        srcSet={srcSet(src, width[1])}
      />
    </Image>
  );
};

export default CoverImage;
