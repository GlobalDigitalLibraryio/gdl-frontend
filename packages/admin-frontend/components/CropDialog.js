// @flow

import React from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@material-ui/core/';
import type { ImageParameters } from '../types';
import Crop from './Crop';

type Props = {
  imageUrl: string,
  ratio: number,
  notifyDialogOk: (croppedParameters: ?ImageParameters) => void,
  notifyDialogCancelled: () => void
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
    this.props.notifyDialogOk(this.state.croppedParameters);
  };

  handleDialogCancel = () => {
    // Communicate to the parent that the dialog was closed
    this.props.notifyDialogCancelled();
  };

  handleCroppedParametersReceived = (croppedParameters: ImageParameters) => {
    this.setState({ croppedParameters: croppedParameters });
  };

  render() {
    return (
      <Dialog open onClose={this.handleDialogCancel}>
        <DialogTitle>Crop image</DialogTitle>
        <DialogContent>
          <div>
            <Crop
              ratio={this.props.ratio}
              imageUrl={this.props.imageUrl}
              passCroppedParameters={croppedParameters => {
                this.handleCroppedParametersReceived(croppedParameters);
              }}
            />
          </div>
        </DialogContent>

        <DialogActions>
          <Button color="primary" onClick={this.handleDialogCancel}>
            Cancel
          </Button>

          <Button
            color="primary"
            onClick={() => {
              this.handleDialogOk();
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
