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
import MetadataFormFields from './MetadataFormFields';

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

export default class FileDialog extends React.Component<Props, State> {
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

  render() {
    const initialMetadata = {
      externalId: Date.now().toString(10),
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
      language: this.props.language
    };

    return (
      <Dialog open onClose={this.closeDialog}>
        <DialogTitle>Upload image</DialogTitle>
        <Form
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
                <MetadataFormFields
                  names={{
                    title: 'title',
                    alttext: 'alttext',
                    license: 'copyright.license.license',
                    origin: 'copyright.origin',
                    caption: 'caption'
                  }}
                  licenses={this.state.licenses}
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
    const descriptionForLicense =
      this.state.licenses &&
      this.state.licenses.find(
        // $FlowFixMe
        element => element.license === values.copyright.license.license
        // $FlowFixMe
      ).description;

    const payload = {
      ...values,
      language: this.props.language,
      copyright: {
        license: {
          license: values.copyright.license.license,
          description: descriptionForLicense
        },
        origin: values.copyright.origin,
        rightsholders: [],
        creators: [],
        processors: []
      }
    };

    if (this.props.selectedFile) {
      const result = await uploadNewImage(this.props.selectedFile, payload);
      if (result.isOk) {
        this.props.onUpload(result.data.imageUrl);
      }
    }
    this.revokeObjectURL();
  };
}
