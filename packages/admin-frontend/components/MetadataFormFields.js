// @flow
import React from 'react';
import { Field } from 'react-final-form';

import {
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  TextField
} from '@material-ui/core';

const LICENSES = [
  '',
  'bruk meg til alt',
  'ikke alt, men noe',
  'bare hvis du er kul'
];


export const MetadataFormFields = () => {
  return (
    <div>
      <Field
        name="title"
        render={({ input, meta }) => (
          <div>
            <TextField
              fullWidth
              error={meta.error && meta.touched}
              margin="normal"
              label="Title"
              {...input}
            />
            {meta.error &&
              meta.touched && (
                <FormHelperText error>{meta.error}</FormHelperText>
              )}
          </div>
        )}
      />

      <Field
        name="alttext"
        render={({ input, meta }) => (
          <div>
            <TextField
              fullWidth
              error={meta.error && meta.touched}
              margin="normal"
              label="Alttext"
              {...input}
            />
            {meta.error &&
              meta.touched && (
                <FormHelperText error>{meta.error}</FormHelperText>
              )}
          </div>
        )}
      />

      <Field
        name="origin"
        render={({ input, meta }) => (
          <div>
            <TextField
              fullWidth
              error={meta.error && meta.touched}
              margin="normal"
              label="Origin"
              {...input}
            />
            {meta.error &&
              meta.touched && (
                <FormHelperText error>{meta.error}</FormHelperText>
              )}
          </div>
        )}
      />

      <Field
        label="License"
        name="license"
        render={({ input, meta }) => (
          <div>
            <FormControl margin="normal">
              <InputLabel>License</InputLabel>
              <Select fullWidth {...input} native>
                {LICENSES.map(license => (
                  <option key={license} value={license}>
                    {license}
                  </option>
                ))}
              </Select>
              {meta.error &&
                meta.touched && (
                  <FormHelperText error>{meta.error}</FormHelperText>
                )}
            </FormControl>
          </div>
        )}
      />
    </div>
  );
};
