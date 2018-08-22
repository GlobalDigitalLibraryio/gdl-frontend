// @flow

import React from 'react';
import { Field } from 'react-final-form';
import { TextField, FormControl, InputLabel, Select } from '@material-ui/core';
import Row from './Row';
import isEmptyString from '../lib/isEmptyString';
import type { License } from '../types';

type Props = {
  licenses: ?Array<License>
};

export default class ImageMetadataForm extends React.Component<Props> {
  render() {
    return (
      <Row autoFlow="row">
        <Field
          name="title"
          render={({ input, meta }) => (
            <TextField
              fullWidth
              error={meta.error && meta.touched}
              label="Title"
              {...input}
            />
          )}
        />

        <Field
          name="alttext"
          render={({ input, meta }) => (
            <TextField
              fullWidth
              error={meta.error && meta.touched}
              label="Alternative text"
              {...input}
            />
          )}
        />
        <Field
          name="caption"
          render={({ input, meta }) => (
            <TextField
              fullWidth
              error={meta.error && meta.touched}
              label="Caption"
              {...input}
            />
          )}
        />
        <Field
          name="copyright.origin"
          render={({ input, meta }) => (
            <TextField
              fullWidth
              error={meta.error && meta.touched}
              label="Origin"
              {...input}
            />
          )}
        />
        <Field
          name="copyright.license.license"
          render={({ input, meta }) => (
            <FormControl error={meta.error && meta.touched} fullWidth>
              <InputLabel>License</InputLabel>
              <Select {...input} native>
                <option key="" value="" />
                {this.props.licenses &&
                  this.props.licenses.map((license: License) => (
                    <option key={license.license} value={license.license}>
                      {license.description}
                    </option>
                  ))}
              </Select>
            </FormControl>
          )}
        />
      </Row>
    );
  }
}

export function validateForm(values: Object) {
  const errors = {};

  if (isEmptyString(values.title)) {
    errors.title = 'You have to enter a title';
  }

  if (isEmptyString(values.alttext)) {
    errors.alttext = 'You have to enter an alternative text';
  }

  if (isEmptyString(values.caption)) {
    errors.caption = 'You have to enter a caption';
  }

  let originError, licenseError;

  if (values.copyright && isEmptyString(values.copyright.origin)) {
    originError = 'You have to enter an origin';
  }

  if (
    values.copyright &&
    values.copyright.license &&
    isEmptyString(values.copyright.license.license)
  ) {
    licenseError = { license: 'You have to choose a license' };
  }

  errors.copyright = {
    origin: originError,
    license: licenseError
  };

  return errors;
}
