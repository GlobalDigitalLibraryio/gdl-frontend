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
import { LICENSES } from '../data/licenses';
import { SOURCES } from '../data/sources';
import { uploadNewImage } from '../lib/fetch';
import MetadataFormFields from './MetadataFormFields';

type Props = {
  onUpload: (imageUrl: string) => void,
  onCancel: () => void,
  selectedFile: File,
  objectURL: string
};

const initialMetadata = {
  externalId: Date.now().toString(10),
  copyright: {
    license: {
      license: LICENSES[0].license,
      description: ''
    },
    origin: SOURCES[0].code,
    creators: [],
    processors: [],
    rightsholders: []
  },
  tags: [],
  // Todo: list of languages to select from?
  language: 'en'
};

export default class FileDialog extends React.Component<Props> {
  render() {
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
    const descriptionForLicense = LICENSES.find(
      element => {
        console.log('tet');
        return element.license === values.copyright.license.license;
      }
      // $FlowFixMe
    ).description;
    console.log(values);

    const payload = {
      ...values,
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
