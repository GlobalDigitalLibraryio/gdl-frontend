// @flow

import React from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@material-ui/core/';
import type { ImageParameters } from '../../types';
import Crop from './Crop';

type Props = {
  imageUrl: string,
  ratio: number,
  onDialogOk: (croppedParameters: ImageParameters) => void,
  onDialogCancelled: () => void
};

type State = {
  croppedParameters: ?ImageParameters
};

export default class CropDialog extends React.Component<Props, State> {
  state = {
    croppedParameters: null
  };

  handleDialogOk = () => {
    // Communicate to the parent that the dialog was closed and the image parameters that we should use for showing the image
    this.state.croppedParameters &&
      this.props.onDialogOk(this.state.croppedParameters);
  };

  handleDialogCancel = () => {
    // Communicate to the parent that the dialog was closed
    this.props.onDialogCancelled();
  };

  handleCroppedParametersReceived = (croppedParameters: ImageParameters) => {
    this.setState({ croppedParameters: croppedParameters });
  };

  render() {
    return (
      <Dialog open onClose={this.handleDialogCancel}>
        <DialogTitle>Crop image</DialogTitle>
        <DialogContent>
          <Crop
            ratio={this.props.ratio}
            imageUrl={this.props.imageUrl}
            onCrop={croppedParameters => {
              this.handleCroppedParametersReceived(croppedParameters);
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button color="primary" onClick={this.handleDialogCancel}>
            Cancel
          </Button>
          <Button color="primary" onClick={this.handleDialogOk}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
