// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import Image from './Image';

const NO_COVER_PLACEHOLDER_URL = require('../static/placeholder-cover.png');

/**
 * Add query parameters to book cover images so they fit our wanted ratio
 * This also means we don't download the full image, just the part we want
 */
const CoverImage = ({ src, ...props }: { src: ?string }) => {
  const srcOrPlaceholder =
    (src && `${src}?focalX=50&focalY=50&ratio=0.81&width=260`) ||
    NO_COVER_PLACEHOLDER_URL;

  return <Image src={srcOrPlaceholder} {...props} />;
};

export default CoverImage;
