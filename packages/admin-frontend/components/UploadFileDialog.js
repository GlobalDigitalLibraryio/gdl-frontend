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
import { fetchLicenses, uploadNewImage } from '../lib/fetch';
import type { License } from '../types';
import ImageMetadataForm, { validateForm } from './ImageMetadataForm';

type Props = {
  onUpload: (imageUrl: string) => void,
  onCancel: () => void,
  selectedFile: File,
  objectURL: string,
  language: string
};

type State = {
  licenses: ?Array<License>
};

export default class UploadFileDialog extends React.Component<Props, State> {
  state = {
    licenses: null
  };

  componentDidMount() {
    this.fetchLicenses();
  }

  fetchLicenses = async () => {
    const result = await fetchLicenses();

    if (result.isOk) {
      this.setState({ licenses: result.data });
    }
  };

  closeDialog = () => {
    this.props.onCancel();

    this.revokeObjectURL();
  };

  revokeObjectURL = () => {
    URL.revokeObjectURL(this.props.objectURL);
  };

  handleFileUpload = async (values: Object) => {
    const descriptionForLicense =
      this.state.licenses &&
      this.state.licenses.find(
        // $FlowFixMe
        element => element.license === values.copyright.license.license
        // $FlowFixMe
      ).description;

    if (this.props.selectedFile) {
      const data = {
        alttext: values.alttext.alttext,
        copyright: values.copyright,
        externalId: values.externalId,
        language: values.language,
        tags: values.tags,
        title: values.title.title,
        caption: values.title.title
      };
      data.copyright.license.description = descriptionForLicense;
      const result = await uploadNewImage(this.props.selectedFile, data);
      if (result.isOk) {
        this.props.onUpload(result.data.imageUrl);
      }
    }
    this.revokeObjectURL();
  };

  render() {
    const initialMetadata = {
      externalId: Date.now().toString(10),
      language: this.props.language,
      copyright: {
        license: {
          license: '',
          description: undefined
        },
        origin: '',
        creators: [],
        processors: [],
        rightsholders: []
      },
      tags: []
    };

    return (
      <Dialog open onClose={this.closeDialog}>
        <DialogTitle>Upload image</DialogTitle>
        <Form
          validate={validateForm}
          initialValues={initialMetadata}
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
                <ImageMetadataForm licenses={this.state.licenses} />
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
}
