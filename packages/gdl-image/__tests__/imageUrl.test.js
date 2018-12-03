// @flow
import { coverImageUrl } from '../';

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
    variants: null
  };

  const url = coverImageUrl(coverImage);
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

test('it should include fixed coordinates', () => {
  const coverImage = {
    url:
      'https://res.cloudinary.com/djylvyru4/f_auto,q_auto/60e050af18588e74770b8d2baceb4816',
    variants: [{ height: 880, width: 713, x: 13, y: 52, ratio: '0.81' }]
  };

  const url = coverImageUrl(coverImage);

  expect(url.includes('x_13')).toBeTruthy();
  expect(url.includes('y_52')).toBeTruthy();
  expect(url.includes('w_713')).toBeTruthy();
  expect(url.includes('h_880')).toBeTruthy();
});
