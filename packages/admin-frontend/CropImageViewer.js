// @flow

import React from 'react';
import { Edit as EditIcon, Undo as UndoIcon } from '@material-ui/icons';
import CropDialog from './components/CropDialog';
import { imageApiUrl } from './config';
import { EditIconButton, UndoIconButton } from './style/icons';

type State = {
  imageError: boolean,
  imageIsCropped: boolean,
  dialogOpen: boolean,
  croppedImageUrl: string,
  existingParameters: ?Array<{
    forRatio: number,
    imageUrl: string,
    rawImageQueryParameters: {
      cropStartY: number,
      cropEndY: number,
      cropStartX: number,
      cropEndX: number
    }
  }>,
  existingParametersLoaded: boolean
};

type Props = {
  values: FormState,
  form: Form,
  passImageApiBody: (imageApiBody: any) => void
};

export default class CropImageViewer extends React.Component<Props, State> {
  cropDialog: ?CropDialog;

  componentDidMount() {
    this.getExistingParameters();
  }

  state = {
    croppedImageUrl: '',
    imageError: false,
    imageIsCropped: false,
    dialogOpen: false,
    existingParameters: null,
    existingParametersLoaded: false
  };

  // todo: refactor out to fetch.js
  getExistingParameters = async () => {
    const imageUrl = this.props.values.imageUrl.substring(
      this.props.values.imageUrl.lastIndexOf('/')
    );

    const url =
      imageUrl && `${imageApiUrl}/images/stored-parameters${imageUrl}`;
    const response = await fetch(url);

    const result = await response.json();
    if (response.ok) {
      this.setState({
        existingParameters: result,
        existingParametersLoaded: true
      });
    } else {
      this.setState({
        existingParameters: null,
        existingParametersLoaded: true
      });
    }
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
    this.setState({ dialogOpen: false, imageIsCropped: false });
  };
  handleRevertCrop = () => {
    this.setState({ existingParameters: null, imageIsCropped: false });
  };

  handleDialogOk = (
    imageApiBody: {
      forRatio: number,
      imageUrl: string,
      rawImageQueryParameters: {
        cropStartY: number,
        cropEndY: number,
        cropStartX: number,
        cropEndX: number
      }
    },
    imageUrl: string,
    mutator: Mutator
  ) => {
    // We add the timestamp so that react-final form will see that there is a change in the imageurl, and we will then be able to save.
    //mutator.setNewImageUrl(imageUrl + '?timestamp=' + Date.now());

    this.setState({
      // todo: fix the spy that is listening for changes in the text field
      croppedImageUrl: imageUrl,
      dialogOpen: false,
      imageIsCropped: true,
      existingParameters: [imageApiBody]
    });

    this.props.passImageApiBody(imageApiBody);
  };

  render() {
    const values = this.props.values;

    // If there are multiple existing parameters for this image (for example if there is parameters for a book) we select the one with 2.62 as ratioÖ
    let rawImageQueryParameters;
    if (
      this.state.existingParameters &&
      this.state.existingParameters.length > 0
    ) {
      const arrayIndex = findWithAttr(
        this.state.existingParameters,
        'forRatio',
        '2.62'
      );
      rawImageQueryParameters = this.state.existingParameters[arrayIndex]
        .rawImageQueryParameters;
    }

    console.log(this.state);

    return (
      <div css={{ position: 'relative' }}>
        {!this.state.imageIsCropped ? (
          <EditIconButton onClick={this.handleOpen}>
            <EditIcon />
          </EditIconButton>
        ) : (
          <UndoIconButton onClick={this.handleRevertCrop}>
            <UndoIcon />
          </UndoIconButton>
        )}

        {this.state.existingParametersLoaded && (
          <img
            width="100%"
            //todo: remove?
            onError={this.handleImageError}
            onLoad={this.handleImageLoad}
            alt="Featured content"
            src={
              values.imageUrl +
              (rawImageQueryParameters
                ? `?cropStartY=${rawImageQueryParameters.cropStartY}&cropEndY=${
                    rawImageQueryParameters.cropEndY
                  }&cropStartX=${rawImageQueryParameters.cropStartX}&cropEndX=${
                    rawImageQueryParameters.cropEndX
                  }`
                : '')
            }
          />
        )}

        {this.state.dialogOpen && (
          <CropDialog
            ref={instance => {
              this.cropDialog = instance;
            }}
            ratio={2.62}
            // Uses the original image (without the parameters) to create the new cropped image
            imageUrl={
              values.imageUrl.substring(0, values.imageUrl.indexOf('?')) === ''
                ? values.imageUrl
                : values.imageUrl.substring(0, values.imageUrl.indexOf('?'))
            }
            notifyDialogOk={(imageApiBody, imageUrl) =>
              this.handleDialogOk(
                imageApiBody,
                imageUrl,
                this.props.form.mutators
              )
            }
            notifyDialogCancelled={() => this.handleDialogCancelled()}
          />
        )}
      </div>
    );
  }
}

function findWithAttr(array, attr, value) {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i][attr] === value) {
      return i;
    }
  }
  return -1;
}
