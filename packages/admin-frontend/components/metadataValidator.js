// @flow

import { inputStringEmpty } from '../lib/inputStringEmpty';

export function handleValidate(values: Object) {
  const errors = {};

  if (inputStringEmpty(values.title)) {
    errors.title = 'You have to enter a title';
  }

  if (inputStringEmpty(values.alttext)) {
    errors.alttext = 'You have to enter an alternative text';
  }

  if (inputStringEmpty(values.caption)) {
    errors.caption = 'You have to enter a caption';
  }

  let originError, licenseError;

  if (values.copyright && inputStringEmpty(values.copyright.origin)) {
    originError = 'You have to enter an origin';
  }

  if (
    values.copyright &&
    values.copyright.license &&
    inputStringEmpty(values.copyright.license.license)
  ) {
    licenseError = { license: 'You have to choose a license' };
  }

  errors.copyright = {
    origin: originError,
    license: licenseError
  };

  return errors;
}
