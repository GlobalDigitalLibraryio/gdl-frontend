// @flow
import React from 'react';
import { Field } from 'react-final-form';

import {
  FormHelperText,
  TextField
} from '@material-ui/core';

export const MetadataFormFields = () => {
  return (
    <div>
      <Field
        name="title.title"
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
        name="alttext.alttext"
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
        name="caption.caption"
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
        name="copyright.origin"
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
        name="copyright.license.license"
        render={({ input, meta }) => (
          <div>
            <TextField
              fullWidth
              error={meta.error && meta.touched}
              margin="normal"
              label="License"
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
        name="copyright.license.description"
        render={({ input, meta }) => (
          <div>
            <TextField
              fullWidth
              error={meta.error && meta.touched}
              margin="normal"
              label="License description"
              {...input}
            />
            {meta.error &&
              meta.touched && (
                <FormHelperText error>{meta.error}</FormHelperText>
              )}
          </div>
        )}
      />
    </div>
  );
};
