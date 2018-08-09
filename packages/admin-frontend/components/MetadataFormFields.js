// @flow

import React from 'react';
import { Field } from 'react-final-form';
import {
  FormHelperText,
  TextField,
  FormControl,
  InputLabel,
  Select
} from '@material-ui/core';
import type { License } from '../types';

type Props = {
  licenses: ?Array<License>
};

export default class MetadataFormFields extends React.Component<Props> {
  render() {
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
                label="Alternative text"
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
              <FormControl
                error={meta.error && meta.touched}
                fullWidth
                margin="normal"
              >
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
              {meta.error &&
                meta.touched && (
                  <FormHelperText error>{meta.error}</FormHelperText>
                )}
            </div>
          )}
        />
      </div>
    );
  }
}
