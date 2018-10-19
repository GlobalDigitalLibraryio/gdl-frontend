// @flow

import { Form } from 'react-final-form';
import type { FormApi } from 'final-form';
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@material-ui/core';

import {
  fetchImageMetadata,
  fetchLicenses,
  saveImageCropCoordinates,
  updateImageMetadata
} from '../../lib/fetch';
import type {
  CoverImage,
  ImageMetadata,
  ImageCropCoordinates,
  License
} from '../../types';
import Cropper from '../ImageCropper/Cropper';
import ImageMetadataForm, { validateForm } from '../ImageMetadataForm';

type Props = {
  onClose: () => void,
  coverImage: CoverImage
};

type State = {
  alteredCropCoordinates: ?ImageCropCoordinates,
  imageMetadata: ?ImageMetadata,
  licenses: ?Array<License>
};

const BOOK_COVER_ASPECT_RATIO = '0.81';
const BOOK_COVER_ASPECT_RATIO_FLOAT = 0.81;

export default class EditImageDialog extends React.Component<Props, State> {
  state = {
    imageMetadata: null,
    alteredCropCoordinates: null,
    licenses: null
  };

  async componentDidMount() {
    this.fetchImageMetadata();
    this.fetchLicenses();
  }

  async fetchLicenses() {
    const result = await fetchLicenses();

    if (result.isOk) {
      this.setState({ licenses: result.data });
    }
  }

  async fetchImageMetadata() {
    const result = await fetchImageMetadata(this.props.coverImage.imageId);

    if (result.isOk) {
      this.setState({ imageMetadata: result.data });
    }
  }

  handleSave = async (values: Object, form: FormApi) => {
    if (this.state.alteredCropCoordinates) {
      await this.saveCroppedImage();
    }

    if (form.getState().dirty) {
      await this.saveImageMetadata(values);
    }

    this.props.onClose();
  };

  async saveImageMetadata(values: ImageMetadata) {
    await updateImageMetadata(values);
  }

  async saveCroppedImage() {
    if (this.state.alteredCropCoordinates) {
      return saveImageCropCoordinates(
        this.props.coverImage.imageId,
        this.state.alteredCropCoordinates
      );
    }
  }

  handleCrop = (data: ImageCropCoordinates) => {
    this.setState({ alteredCropCoordinates: data });
  };

  render() {
    const isImageCropped = this.state.alteredCropCoordinates != null;

    const { imageMetadata } = this.state;

    return (
      <Dialog open onClose={this.props.onClose}>
        <DialogTitle>Edit image and metadata</DialogTitle>
        <Form
          initialValues={imageMetadata || undefined}
          validate={validateForm}
          onSubmit={this.handleSave}
          render={({ handleSubmit, pristine }) => (
            <div>
              <DialogContent
                style={{ paddingTop: '0px', paddingBottom: '0px' }}
              >
                <Cropper
                  cropCoordinates={
                    imageMetadata &&
                    imageMetadata.imageVariants &&
                    imageMetadata.imageVariants[BOOK_COVER_ASPECT_RATIO]
                  }
                  onCrop={this.handleCrop}
                  imageUrl={this.props.coverImage.url}
                  aspectRatio={BOOK_COVER_ASPECT_RATIO_FLOAT}
                />
                <ImageMetadataForm licenses={this.state.licenses} />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.props.onClose} color="secondary">
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  // If the user cropped the image, the button will be enabled. If the User did not touch the cropper, the pristine value of the form will decide if it is disabled or not.
                  disabled={isImageCropped ? false : pristine}
                  color="primary"
                >
                  Save
                </Button>
              </DialogActions>
            </div>
          )}
        />
      </Dialog>
    );
  }
}
