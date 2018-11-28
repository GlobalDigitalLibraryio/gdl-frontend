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
    const { licenses } = this.props;
    return (
      <Row autoFlow="row">
        <Field
          name="title.title"
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
          name="alttext.alttext"
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
          name="copyright.license"
          render={({ input, meta }) => (
            <FormControl error={meta.error && meta.touched} fullWidth>
              <InputLabel>License</InputLabel>
              <Select
                {...input}
                // Native select operates on value strings
                value={input.value && input.value.license}
                onChange={event =>
                  input.onChange(
                    licenses &&
                      licenses.find(l => l.license === event.target.value)
                  )
                }
                native
              >
                <option key="" value="" />
                {licenses &&
                  licenses.map(license => (
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

  if (!values.title || isEmptyString(values.title.title)) {
    errors.title = { title: true };
  }

  if (!values.alttext || isEmptyString(values.alttext.alttext)) {
    errors.alttext = { alttext: true };
  }

  if (values.copyright && isEmptyString(values.copyright.origin)) {
    errors.copyright = { origin: true };
  }

  if (
    values.copyright &&
    values.copyright.license &&
    isEmptyString(values.copyright.license.license)
  ) {
    errors.copyright = {
      ...errors.copyright,
      license: { license: true }
    };
  }

  return errors;
}
