// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { css, cx } from 'react-emotion';
import Image from './Image';
import { TABLET_BREAKPOINT } from '../style/theme/misc';

const NO_COVER_PLACEHOLDER_URL = require('../static/placeholder-cover.png');

// The pixel widths of the book covers. The first value in the array is mobile, the second value is >= tablet
const SMALL_WIDTHS = [105, 130];
const LARGE_WIDTHS = [130, 260];

/*
* Returns a size attribute string, eg: (min-width: 768px) 260px, 130px
*/
const sizesAttr = (widths: [number, number]) =>
  `(min-width: ${TABLET_BREAKPOINT}px) ${widths[1]}px, ${widths[0]}px`;

/**
 * Returns an URL with lots of query parameters for the image
 */
const srcUrl = (src, width) =>
  `${src}?storedRatio=0.81&focalX=50&focalY=50&ratio=0.81&width=${width}`;

/**
 * Create a function that returns a srcset attribute, eg: src.png 1024w,src.png 640, src.png 320w
 */
const srcSetAttr = (widths: [number, number | number]) => src =>
  widths.map(width => `${srcUrl(src, width)} ${width}w`).join(',');

/* We precompute most of the stuff so we don't have to do this every render for all the covers we show (which are many)
* The final width element we compute in srcSetAttr is so high resolution screens can request bigger images if they want
*/
const sizes = {
  small: {
    width: SMALL_WIDTHS.map(w => w + 'px'),
    height: ['130px', '160px'],
    sizesAttr: sizesAttr(SMALL_WIDTHS),
    // $FlowFixMe
    srcSetAttr: srcSetAttr([...SMALL_WIDTHS, Math.floor(SMALL_WIDTHS[1] * 1.5)])
  },
  large: {
    width: LARGE_WIDTHS.map(w => w + 'px'),
    height: ['175px', '365px'],
    sizesAttr: sizesAttr(LARGE_WIDTHS),
    // $FlowFixMe
    srcSetAttr: srcSetAttr([...LARGE_WIDTHS, Math.floor(LARGE_WIDTHS[1] * 1.5)])
  }
};

type Props = {
  className?: string,
  noShadow?: boolean,
  // By using predetermined sizes for the book covers,
  // we make sure to take advantage of the client's browser cache to not redownload the image in lots of different sizes on different pages
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
        responsiveHeight={sizes[size].height}
        // $FlowFixMe
        responsiveWidth={sizes[size].width}
        src={NO_COVER_PLACEHOLDER_URL}
      />
    );
  }

  return (
    <Image
      ariaHidden
      className={cn}
      responsiveHeight={sizes[size].height}
      // $FlowFixMe
      responsiveWidth={sizes[size].width}
      // IE doesn't support srcSet / sizes, so we can't just use raw image here, cause it could be big
      src={srcUrl(src, size === 'large' ? LARGE_WIDTHS[1] : SMALL_WIDTHS[1])}
      srcSet={sizes[size].srcSetAttr(src)}
      sizes={sizes[size].sizesAttr}
    />
  );
};

export default CoverImage;

const shadowStyle = css`
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);
`;
