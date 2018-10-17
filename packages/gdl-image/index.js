// @flow

type TransformationOptions = {
  aspectRatio?: number,
  width?: number
};

const transformationsMap = {
  aspectRatio: ratio => `ar_${ratio},c_fill`,
  width: width => `w_${width}`
};

/**
 * We have some default transformations
 * f_auto: Automatically optimize image format. By using webp for browsers that support it. https://cloudinary.com/documentation/image_optimization#how_to_optimize_image_format
 * q_auto: Automatic image quality optimization. https://cloudinary.com/documentation/image_optimization#use_q_auto_automatic_quality_and_encoding
 * c_scale, w_auto: Automatic image width from client hints https://cloudinary.com/documentation/responsive_images#automatic_image_width
 * dpr_auto: Automatic detection of users device pixel ratio for browsers that support client hints https://cloudinary.com/documentation/responsive_images#automatic_pixel_density_detection
 */
const defaultTransformations = 'f_auto,q_auto,dpr_auto,c_scale,w_auto';

/**
 * Builds up a cloudinary URL with parameters
 */
export function imageUrl(url: string, options: TransformationOptions = {}) {
  // TODO: Remove this when all images in all environments are migrated to Cloudinary
  if (!url.includes('cloudinary')) {
    return url;
  }

  const transformations = Object.entries(options)
    .map(([key, value]) => transformationsMap[key](value))
    .join(',');

  // Since we only receive a whole URL from the backend, we use this trickery to split the url into two parts that we later combine with our transformations
  const [urlPrefix, urlSuffix] = url.split(/\/f_auto,q_auto\//);

  return `${urlPrefix}/${defaultTransformations}/${
    transformations.length ? transformations + '/' : ''
  }${urlSuffix}`;
}
