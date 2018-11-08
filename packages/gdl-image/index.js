// @flow

type TransformationOptions = {
  aspectRatio?: number,
  width?: number
};

type ImageCropCoordinates = {
  x: number,
  height: number,
  y: number,
  width: number,
  ratio: string,
  revision: number
};

type CoverImage = {
  url: string,
  variants?: {
    [string]: ImageCropCoordinates
  }
};

const transformationsMap = {
  width: width => `w_${width}`,
  /**
   * If we have defined fixed coordinates for the aspect ratio, use that. Otherwise we fallback to cloudinarys aspect ratio
   */
  aspectRatio: (ratio: number, variants) =>
    Boolean(variants && variants[ratio])
      ? fixedCoordinatesCropping(variants[ratio])
      : `ar_${ratio},c_fill`
};

/**
 * https://cloudinary.com/documentation/image_transformations#fixed_coordinates_cropping
 */
function fixedCoordinatesCropping(c: ImageCropCoordinates) {
  return `x_${c.x},y_${c.y},w_${c.width},h_${c.height},c_crop`;
}

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
export function imageUrl(
  coverImage: $ReadOnly<CoverImage>,
  options: TransformationOptions = {}
): string {
  // TODO: Remove this when all images in all environments are migrated to Cloudinary
  if (!coverImage.url.includes('cloudinary')) {
    return coverImage.url;
  }

  const transformations = Object.entries(options)
    .map(([key, value]) => transformationsMap[key](value, coverImage.variants))
    .join(',');

  // Since we only receive a whole URL from the backend, we use this trickery to split the url into two parts that we later combine with our transformations
  const [urlPrefix, urlSuffix] = coverImage.url.split(/\/f_auto,q_auto\//);

  return `${urlPrefix}/${
    transformations ? transformations + '/' : ''
  }${defaultTransformations}/${urlSuffix}`;
}
