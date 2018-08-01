// @flow

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from '@material-ui/core';
import React from 'react';
import { Form } from 'react-final-form';
import { uploadNewImage } from '../lib/fetch';
import { MetadataFormFields } from './MetadataFormFields';
type Props = {
  onUpload: (imageUrl: string) => void,
  onCancel: () => void,
  selectedFile: File,
  objectURL: string
};

export default class FileDialog extends React.Component<Props> {
  render() {
    return (
      <Dialog open onClose={this.closeDialog}>
        <DialogTitle>Upload file</DialogTitle>
        <Form
          validate={handleValidate}
          onSubmit={this.handleFileUpload}
          render={({ handleSubmit, pristine, invalid }) => (
            <div>
              <DialogContent
                style={{ paddingTop: '0px', paddingBottom: '0px' }}
              >
                <img
                  src={this.props.objectURL}
                  onLoad={this.revokeObjectURL}
                  alt="Uploaded"
                  width="100%"
                />
                <MetadataFormFields />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.closeDialog} color="secondary">
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={pristine || invalid}
                  color="primary"
                >
                  Upload
                </Button>
              </DialogActions>
            </div>
          )}
        />
      </Dialog>
    );
  }

  closeDialog = () => {
    this.props.onCancel();

    this.revokeObjectURL();
  };

  revokeObjectURL = () => {
    URL.revokeObjectURL(this.props.objectURL);
  };

  handleFileUpload = async (values: Object) => {
    const license = JSON.parse(values.license);

    const metadata = {
      externalId: Date.now().toString(10),
      title: values.title,
      alttext: values.alttext,
      copyright: {
        license: {
          license: license.license,
          description: license.description
        },
        origin: values.origin,
        creators: [],
        processors: [],
        rightsholders: []
      },
      tags: [],
      caption: values.caption,
      language: 'en'
    };

    if (this.props.selectedFile) {
      const result = await uploadNewImage(this.props.selectedFile, metadata);

      if (result.isOk) {
        this.props.onUpload(result.data.imageUrl);
      }
    }

    this.revokeObjectURL();
  };
}

function handleValidate(values) {
  const errors = {};

  if (values.title === undefined || values.title.trim() === '') {
    errors.title = 'You have to enter a title';
  }

  if (values.alttext === undefined || values.alttext.trim() === '') {
    errors.alttext = 'You have to enter a alttext';
  }

  if (values.origin === undefined || values.origin.trim() === '') {
    errors.origin = 'You have to specify origin';
  }

  if (values.license === undefined || values.license === '') {
    errors.license = 'You have to choose a license';
  }

  if (values.caption === undefined || values.caption.trim() === '') {
    errors.caption = 'You have to specify a caption';
  }

  return errors;
}
