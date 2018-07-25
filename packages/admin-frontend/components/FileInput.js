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
  selectedLanguage: boolean,
  passUploadedImageUrl: (imageUrl: string) => void
};

type State = {
  fileDialogOpen: boolean,
  fileChosen: string,
  key: string,
  file: ?File
};

export default class FileInput extends React.Component<Props, State> {
  state = {
    fileDialogOpen: false,
    fileChosen: '',
    key: '',
    file: null
  };

  render() {
    return (
      <div>
        <input
          disabled={this.props.selectedLanguage}
          // clear the selected file by updating the key attribute
          key={this.state.key}
          type="file"
          id="fileinput"
          onChange={this.handleFileChosen}
        />

        <Dialog open={this.state.fileDialogOpen} onClose={this.handleOnClose}>
          <DialogTitle>Upload file</DialogTitle>
          <DialogContent>
            <p>
              We can create a form here asking for values like alttext or other
              metadata
            </p>

            <img src={this.state.fileChosen} />
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleOnClose} color="secondary">
              Cancel
            </Button>

            <Button onClick={this.handleFileUpload} color="primary">
              Upload
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  handleOnClose = () => {
    // Change the key attribute to reset the file input
    this.setState({ fileDialogOpen: false, key: Date.now().toString(10) });
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

    if (this.state.file) {
      const result = await uploadNewImage(this.state.file, metadata);

      if (result.isOk) {
        this.props.passUploadedImageUrl(result.data.imageUrl);
      }
    }

    // close the dialog
    this.setState({ fileDialogOpen: false });
  };

  handleFileChosen = (event: SyntheticInputEvent<EventTarget>) => {
    this.setState({
      fileDialogOpen: true,
      fileChosen: URL.createObjectURL(event.target.files[0]),
      file: event.target.files[0]
    });
  };
}
