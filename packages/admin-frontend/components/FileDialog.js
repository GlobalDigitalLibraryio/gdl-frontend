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

export default class FileDialog extends React.Component<Props> {
  render() {
    const metadata = {
      externalId: Date.now().toString(10),
      title: "",
      alttext: "",
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

    return (
      <Dialog open onClose={this.closeDialog}>
        <DialogTitle>Upload file</DialogTitle>
        <Form
          initialValues={metadata}
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
    if (this.props.selectedFile) {
      const result = await uploadNewImage(this.props.selectedFile, values);

      if (result.isOk) {
        this.props.onUpload(result.data.imageUrl);
      }
    }

    this.revokeObjectURL();
  };
}
