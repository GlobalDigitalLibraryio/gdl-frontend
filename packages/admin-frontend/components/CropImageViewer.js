// @flow

import React from 'react';
import { Edit as EditIcon } from '@material-ui/icons';
import CropDialog from './CropDialog';
import { EditIconButton } from '../style/icons';
import type { ImageParameters } from '../types';

type State = {
  imageError: boolean,
  dialogOpen: boolean
};

type Props = {
    ratio: number,
  imageUrl: string,
  passCroppedParameters: (croppedParameters: ?ImageParameters) => void
};

export default class CropImageViewer extends React.Component<Props, State> {
  state = {
    imageError: false,
    dialogOpen: false
  };

  handleImageError = () => {
    this.setState({ imageError: true });
  };

  handleImageLoad = () => {
    this.setState({ imageError: false });
  };

  handleOpen = () => {
    this.setState({ dialogOpen: true });
  };

  handleDialogCancelled = () => {
    this.setState({ dialogOpen: false });
  };

  handleDialogOk = (croppedParameters: ?ImageParameters) => {
    this.setState({
      dialogOpen: false
    });

    this.props.passCroppedParameters(croppedParameters);
  };

  render() {
    return (
      <div css={{ position: 'relative' }}>
        {!this.state.imageError && (
          <EditIconButton onClick={this.handleOpen}>
            <EditIcon />
          </EditIconButton>
        )}

        <img
          width="100%"
          onError={this.handleImageError}
          onLoad={this.handleImageLoad}
          alt="Featured content"
          src={this.props.imageUrlNoParameters}
        />

        {this.state.dialogOpen && (
          <CropDialog
            ratio={this.props.ratio}
            imageUrl={this.props.imageUrlNoParameters}
            notifyDialogOk={croppedParameters =>
              this.handleDialogOk(croppedParameters)
            }
            notifyDialogCancelled={() => this.handleDialogCancelled()}
          />
        )}
      </div>
    );
  }
}
