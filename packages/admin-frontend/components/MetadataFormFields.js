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
    license: string
  },
  featurePreview: boolean
};

export default class MetadataFormFields extends React.Component<Props> {
  static defaultProps = {
    featurePreview: false
  };

  render() {
    const featurePreview = this.props.featurePreview;

    return (
      <div>
        {featurePreview && (
          <p>Feature to edit image metadata will be enabled soon!</p>
        )}

        <Field
          name={this.props.names.title}
          render={({ input, meta }) => (
            <div>
              <TextField
                disabled={featurePreview}
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
                disabled={featurePreview}
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
                disabled={featurePreview}
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
              <FormControl disabled={featurePreview} fullWidth margin="normal">
                <InputLabel>Origin</InputLabel>
                <Select {...input} fullWidth native>
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
          name={this.props.names.license}
          render={({ input, meta }) => (
            <div>
              <FormControl disabled={featurePreview} fullWidth margin="normal">
                <InputLabel>License</InputLabel>
                <Select {...input} native>
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
  }
}
