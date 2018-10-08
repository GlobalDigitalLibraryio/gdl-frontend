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
  getImageCropCoordinates,
  saveImageCropCoordinates,
  patchImageMetadata
} from '../lib/fetch';
import type {
  BookDetails,
  ImageMetadata,
  ImageCropCoordinates,
  License
} from '../types';
import Cropper from './ImageCropper/Cropper';
import ImageMetadataForm, { validateForm } from './ImageMetadataForm';

type Props = {
  onClose: () => void,
  book: BookDetails
};

type State = {
  cropCoordinates: ?{ [string]: ImageCropCoordinates },
  alteredCropCoordinates: ?ImageCropCoordinates,
  imageMetadata: ?ImageMetadata,
  licenses: ?Array<License>
};

const BOOK_COVER_ASPECT_RATIO = '0.81';
const BOOK_COVER_ASPECT_RATIO_FLOAT = 0.81;

export default class EditImageDialog extends React.Component<Props, State> {
  state = {
    imageMetadata: null,
    cropCoordinates: null,
    alteredCropCoordinates: null,
    licenses: null
  };

  async componentDidMount() {
    this.fetchImageVariants();
    this.fetchImageMetadata();
    this.fetchLicenses();
  }

  fetchLicenses = async () => {
    const result = await fetchLicenses();

    if (result.isOk) {
      this.setState({ licenses: result.data });
    }
  };

  async fetchImageMetadata() {
    const imageId = this.props.book.coverImage.imageId;
    const imageMetadata = await fetchImageMetadata(imageId);

    if (imageMetadata.isOk) {
      this.setState({ imageMetadata: imageMetadata.data });
    }
  }

  async fetchImageVariants() {
    const cropCoordinatesResult = await getImageCropCoordinates(
      this.props.book.coverImage.imageId
    );

    if (cropCoordinatesResult.isOk) {
      this.setState({ cropCoordinates: cropCoordinatesResult.data });
    }
  }

  handleSave = async (values: Object, form: FormApi) => {
    if (this.state.alteredCropCoordinates) {
      await this.saveCroppedImage();
    }

    if (form.getState().dirty) {
      await this.patchMetadata(values);
    }

    this.props.onClose();
  };

  async patchMetadata(values: Object) {
    // We need to find the description of the selected license
    const descriptionForLicense =
      this.state.licenses &&
      this.state.licenses.find(
        element => element.license === values.copyright.license.license
        // $FlowFixMe
      ).description;

    values.copyright.license.description = descriptionForLicense;

    const imageId = this.props.book.coverImage.imageId;
    await patchImageMetadata(imageId, values);
  }

  async saveCroppedImage() {
    if (this.state.alteredCropCoordinates) {
      return saveImageCropCoordinates(
        this.props.book.coverImage.imageId,
        this.state.alteredCropCoordinates
      );
    }
  }

  handleCrop = (data: ImageCropCoordinates) => {
    this.setState({ alteredCropCoordinates: data });
  };

  render() {
    const isImageCropped = this.state.alteredCropCoordinates != null;

    const metadata = this.state.imageMetadata;

    // Set the initial metadata in the same format as the payload, in this way react final form will work on this object and make it ready to post it. The only thing we need to add is the description.
    const initialMetadata = metadata
      ? {
          language: this.props.book.language.code,
          alttext: metadata.alttext.alttext,
          caption: metadata.caption.caption,
          title: metadata.title.title,
          copyright: {
            license: {
              license: metadata.copyright.license.license,
              description: undefined
            },
            origin: metadata.copyright.origin,
            rightsholders: [],
            creators: [],
            processors: []
          }
        }
      : {};

    return (
      <Dialog open onClose={this.props.onClose}>
        <DialogTitle>Edit image and metadata</DialogTitle>
        <Form
          initialValues={initialMetadata}
          validate={validateForm}
          onSubmit={this.handleSave}
          render={({ handleSubmit, pristine }) => (
            <div>
              <DialogContent
                style={{ paddingTop: '0px', paddingBottom: '0px' }}
              >
                {/* We don't want to render the cropper until we have fetched the stored parameters. The cropper uses the stored parameters to show the current cropped area on the image. */}
                {this.state.cropCoordinates && (
                  <Cropper
                    cropCoordinates={
                      this.state.cropCoordinates[BOOK_COVER_ASPECT_RATIO]
                    }
                    onCrop={this.handleCrop}
                    imageUrl={this.props.book.coverImage.url}
                    aspectRatio={BOOK_COVER_ASPECT_RATIO_FLOAT}
                  />
                )}
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
