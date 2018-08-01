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
  { license: '', description: '' },
  {
    license: 'by-4.0',
    description: 'Creative Commons Attribution 2.0 Generic'
  },
  {
    license: 'by-sa',
    description: 'Creative Commons Attribution-ShareAlike 2.0 Generic'
  }
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
        name="caption"
        render={({ input, meta }) => (
          <div>
            <TextField
              fullWidth
              error={meta.error && meta.touched}
              margin="normal"
              label="Caption"
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
                  <option
                    key={license.description}
                    value={JSON.stringify(license)}
                  >
                    {license.description}
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
