import { imageUrl } from '../';

/**
 * The order of the transformations matter! Chrome on Android sends request headers that
 * indicate the device pixel ratio and screen width. Cloudinary can use these values to
 * optimize the device. If this transformation is in the chain before the transform for
 * cropped images, than the cropping is skewed because the width of the image has changed.
 */
test('it should chain the transformations in the right order', () => {
  const coverImage = {
    url:
      'https://res.cloudinary.com/djylvyru4/f_auto,q_auto/673e68b380bc1a6af69ea00f808bd3f8',
    imageId: '1234'
  };

  const url = imageUrl(coverImage, { aspectRatio: 0.81 });
  const splits = url.split('/');

  // Get the array index of the splits
  const qualityTransformationIndex = splits.findIndex(s =>
    s.includes('f_auto')
  );
  const ratioTransformationIndex = splits.findIndex(s => s.includes('c_fill'));

  // findIndex returns a negative number for no matches, so ensure we have match
  expect(qualityTransformationIndex).toBeGreaterThan(0);
  expect(ratioTransformationIndex).toBeGreaterThan(0);

  // Finally we make sure that the quality transform is the last in the chain
  expect(qualityTransformationIndex).toBeGreaterThan(ratioTransformationIndex);
});
