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
  // Since we operate on different objects from the backend we want to specify the nesting of the names so that react-final-form can edit the value-object for us
  names: {
    title: string,
    alttext: string,
    caption: string,
    origin: string,
    license: string
  },
  licenses: ?Array<License>
};

export default class MetadataFormFields extends React.Component<Props> {
  render() {
    return (
      <div>
        <Field
          name={this.props.names.title}
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
          name={this.props.names.alttext}
          render={({ input, meta }) => (
            <div>
              <TextField
                fullWidth
                error={meta.error && meta.touched}
                margin="normal"
                label="Alt text"
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
          name={this.props.names.caption}
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
          name={this.props.names.origin}
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
          name={this.props.names.license}
          render={({ input, meta }) => (
            <div>
              <FormControl fullWidth margin="normal">
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
  }
}
