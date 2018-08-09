// @flow

import { inputFieldEmpty } from '../lib/inputStringEmpty';

export function handleValidate(values: Object) {
  const errors = {};

  if (inputFieldEmpty(values.title)) {
    errors.title = 'You have to enter a title';
  }

  if (inputFieldEmpty(values.alttext)) {
    errors.alttext = 'You have to enter an alternative text';
  }

  if (inputFieldEmpty(values.caption)) {
    errors.caption = 'You have to enter a caption';
  }

  let originError, licenseError;

  if (values.copyright && inputFieldEmpty(values.copyright.origin)) {
    originError = 'You have to enter an origin';
  }

  if (
    values.copyright &&
    values.copyright.license &&
    inputFieldEmpty(values.copyright.license.license)
  ) {
    licenseError = { license: 'You have to choose a license' };
  }

  errors.copyright = {
    origin: originError,
    license: licenseError
  };

  return errors;
}
