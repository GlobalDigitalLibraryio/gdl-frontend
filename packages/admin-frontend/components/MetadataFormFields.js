// @flow

import React from 'react';
import { Field } from 'react-final-form';
import { LICENSES } from '../data/licenses';
import { SOURCES } from '../data/sources';

import {
  FormHelperText,
  TextField,
  FormControl,
  InputLabel,
  Select
} from '@material-ui/core';

type Props = {
  // Since we operate on different objects from the backend we want to specify the nesting of the names so that react-final-form can edit the value-object for us
  names: {
    title: string,
    alttext: string,
    caption: string,
    origin: string,
    license: string,
    licenseDescription: string
  }
};

export const MetadataFormFields = (props: Props) => {
  return (
    <div>
      <Field
        name={props.names.title}
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
        name={props.names.alttext}
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
        name={props.names.caption}
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
        label="Origin"
        name={props.names.origin}
        render={({ input, meta }) => (
          <div>
            <FormControl fullWidth margin="normal">
              <InputLabel>Origin</InputLabel>
              <Select fullWidth {...input} native value>
                {SOURCES.map(source => (
                  <option key={source.code} value={source.code}>
                    {source.name}
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

      <Field
        label="License"
        name={props.names.license}
        render={({ input, meta }) => (
          <div>
            <FormControl fullWidth margin="normal">
              <InputLabel>License</InputLabel>
              <Select {...input} native value>
                {LICENSES.map(license => (
                  <option key={license.license} value={license.license}>
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
