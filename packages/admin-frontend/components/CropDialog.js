// @flow

import React from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@material-ui/core/';
import Crop from './Crop';

type Props = {
  imageUrl: string,
  ratio: number,
  notifyDialogOk: (
    imageApiBody: any,
    imageUrl: string
  ) => void,
  notifyDialogCancelled: () => void
};

type State = {
  imageApibody: any
};

export default class CropDialog extends React.Component<Props, State> {
  state = {
    imageApiBody: null
  };

  handleDialogOk = () => {
    // Communicate to the parent that the dialog was closed and the image parameters that we should use for showing the image
    this.props.notifyDialogOk(
      this.state.imageApiBody,
        this.props.imageUrl
    );
  };

  handleDialogCancel = () => {
    // Communicate to the parent that the dialog was closed but use the same imageurl
    this.props.notifyDialogCancelled();
  };

  handleImageApiBodyReceived = (imageApiBody: any) => {
    this.setState({ imageApiBody: imageApiBody });
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
              passImageApiBody={imageApiBody => {
                this.handleImageApiBodyReceived(imageApiBody);
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
