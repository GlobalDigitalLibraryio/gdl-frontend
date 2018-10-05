// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { css, cx } from 'react-emotion';
import { imageUrl } from 'gdl-image';

import Image from './Image';
import { TABLET_BREAKPOINT } from '../style/theme/misc';

const NO_COVER_PLACEHOLDER_URL = require('../static/placeholder-cover.png');

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
  src: ?string
};

/**
 * Add query parameters to book cover images so they fit our wanted ratio
 * This also means we don't download the full image, just the part we want
 *
 * We hide the cover image from screen readers, as the title of the book should be enough
 */

const CoverImage = ({ src, size, className, noShadow = false }: Props) => {
  const cn = cx({ [shadowStyle]: !noShadow }, className);

  if (src == null) {
    return (
      <Image
        ariaHidden
        className={cn}
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
      className={cn}
      responsiveHeight={sizesMap[size].height}
      responsiveWidth={widths}
      src={imageUrl(src, {
        aspectRatio: 0.81
      })}
      sizes={sizes}
    />
  );
};

export default CoverImage;

const shadowStyle = css`
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);
`;
