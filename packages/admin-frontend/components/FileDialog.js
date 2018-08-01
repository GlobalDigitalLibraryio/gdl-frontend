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
import { handleValidate } from '../lib/metadataValidator';
import { MetadataFormFields } from './MetadataFormFields';

type Props = {
  onUpload: (imageUrl: string) => void,
  onCancel: () => void,
  selectedFile: File,
  objectURL: string
};

const initialMetadata = {
  externalId: Date.now().toString(10),
  title: '',
  alttext: '',
  copyright: {
    license: {
      license: '',
      description: ''
    },
    origin: '',
    creators: [],
    processors: [],
    rightsholders: []
  },
  tags: [],
  caption: '',
  language: 'en'
};

export default class FileDialog extends React.Component<Props> {
  render() {
    return (
      <Dialog open onClose={this.closeDialog}>
        <DialogTitle>Upload file</DialogTitle>
        <Form
          initialValues={initialMetadata}
          // validate={handleValidate}
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
                <MetadataFormFields
                  names={{
                    title: 'title',
                    alttext: 'alttext',
                    license: 'copyright.license.license',
                    licenseDescription: 'copyright.license.description',
                    origin: 'copyright.origin',
                    caption: 'caption'
                  }}
                />
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
    if (this.props.selectedFile) {
      const result = await uploadNewImage(this.props.selectedFile, values);

      if (result.isOk) {
        this.props.onUpload(result.data.imageUrl);
      }
    }

    this.revokeObjectURL();
  };
}
