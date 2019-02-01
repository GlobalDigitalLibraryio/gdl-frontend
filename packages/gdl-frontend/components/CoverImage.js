// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { css } from '@emotion/core';

import Image from './Image';
import { TABLET_BREAKPOINT } from '../style/theme/misc';

const NO_COVER_PLACEHOLDER_URL = '/static/placeholder-cover.png';

const sizesMap = {
  small: {
    width: ['105px', '130px'],
    height: ['130px', '160px']
  },
  large: {
    width: ['180px', '310px'],
    height: ['220px', '380px']
  }
};

type Props = {
  className?: string,
  noShadow?: boolean,
  // By using predetermined sizes for the book covers, we make sure to take advantage of the client's browser cache to not redownload the image in lots of different sizes on different pages
  size: 'small' | 'large',
  coverImage: ?$ReadOnly<{
    url: string
  }>
};

/**
 * Add query parameters to book cover images so they fit our wanted ratio
 * This also means we don't download the full image, just the part we want
 *
 * We hide the cover image from screen readers, as the title of the book should be enough
 */

const CoverImage = ({
  coverImage,
  size,
  className,
  noShadow = false
}: Props) => {
  if (coverImage == null) {
    return (
      <Image
        ariaHidden
        className={className}
        css={[!noShadow && shadowStyle]}
        responsiveHeight={sizesMap[size].height}
        // $FlowFixMe
        responsiveWidth={sizesMap[size].width}
        src={NO_COVER_PLACEHOLDER_URL}
      />
    );
  }

  const widths = sizesMap[size].width;

  // Browsers that support client hints sends additonal request headers to cloudinary so it can further optimize images
  const sizes = `(min-width: ${TABLET_BREAKPOINT}px) ${widths[1]}, ${
    widths[0]
  }`;

  return (
    <Image
      ariaHidden
      className={className}
      css={[!noShadow && shadowStyle]}
      crossOrigin="anonymous"
      responsiveHeight={sizesMap[size].height}
      responsiveWidth={widths}
      src={coverImage.url}
      sizes={sizes}
    />
  );
};

export default CoverImage;

const shadowStyle = css`
  box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.1);
`;
