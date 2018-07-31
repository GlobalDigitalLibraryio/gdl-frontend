// @flow

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from '@material-ui/core';
import React from 'react';
import { uploadNewImage } from '../lib/fetch';
type Props = {
  onUpload: (imageUrl: string) => void,
  onCancel: () => void,
  fileDialogOpen: boolean,
  selectedFile: File,
  objectURL: string
};

export default class FileDialog extends React.Component<Props> {
  render() {
    return (
      <Dialog open={this.props.fileDialogOpen} onClose={this.closeDialog}>
        <DialogTitle>Upload file</DialogTitle>
        <DialogContent>
          <p>
            We can create a form here asking for values like alttext or other
            metadata
          </p>
          <img
            src={this.props.objectURL}
            onLoad={this.revokeObjectURL}
            alt="Uploaded"
            width="100%"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={this.closeDialog} color="secondary">
            Cancel
          </Button>

          <Button onClick={this.handleFileUpload} color="primary">
            Upload
          </Button>
        </DialogActions>
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

  handleFileUpload = async () => {
    // Dummy metadata until we want to enter something useful in here
    const metadata = {
      externalId: Date.now().toString(10),
      title: 'usefultitle',
      alttext: 'this is an alttext',
      copyright: {
        license: {
          license: 'by-4.0',
          description: 'Creative Commons Attribution 4.0 International'
        },
        origin: 'storyweaver',
        creators: [],
        processors: [],
        rightsholders: []
      },
      tags: [],
      caption: 'something',
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
