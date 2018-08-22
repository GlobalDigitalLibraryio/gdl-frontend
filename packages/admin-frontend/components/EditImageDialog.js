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
  fetchStoredParameters,
  patchImageMetadata,
  postStoredParameters
} from '../lib/fetch';
import type {
  BookDetails,
  ImageMetadata,
  ImageParameters,
  License,
  StoredParameters
} from '../types';
import Crop from './ImageCropper/Crop';
import ImageMetadataForm, { validateForm } from './ImageMetadataForm';

type Props = {
  onClose: () => void,
  book: BookDetails
};

type State = {
  croppedParameters: ?ImageParameters,
  existingStoredParameters: ?StoredParameters,
  existingStoredParametersLoaded: boolean,
  imageMetadata: ?ImageMetadata,
  licenses: ?Array<License>
};

export default class EditImageDialog extends React.Component<Props, State> {
  state = {
    croppedParameters: null,
    existingStoredParameters: null,
    existingStoredParametersLoaded: false,
    imageMetadata: null,
    licenses: null
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    await this.fetchStoredParameters();
    await this.fetchImageMetadata();
    await this.fetchLicenses();
  };

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

  async fetchStoredParameters() {
    const storedParameters = await fetchStoredParameters(
      this.props.book.coverImage.url.substring(
        this.props.book.coverImage.url.lastIndexOf('/')
      )
    );

    if (storedParameters.isOk) {
      this.setState({
        existingStoredParameters: storedParameters.data[0],
        existingStoredParametersLoaded: true
      });
    } else {
      this.setState({
        existingStoredParameters: null,
        existingStoredParametersLoaded: true
      });
    }
  }

  handleSave = async (values: Object, form: FormApi) => {
    if (this.state.croppedParameters) {
      await this.postCroppedImage(this.state.croppedParameters);
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

  async postCroppedImage(croppedParameters: ImageParameters) {
    const imageApiBody = {
      rawImageQueryParameters: croppedParameters,
      forRatio: '0.81',
      revision: this.state.existingStoredParameters
        ? this.state.existingStoredParameters.revision
        : 1,
      imageUrl: this.props.book.coverImage.url.substring(
        this.props.book.coverImage.url.lastIndexOf('/')
      )
    };

    const result = await postStoredParameters(imageApiBody);
    if (result.isOk) {
      this.setState({ existingStoredParameters: result.data });
    }
  }

  handleCroppedParametersReceived = (croppedParameters: ImageParameters) => {
    this.setState({ croppedParameters: croppedParameters });
  };

  render() {
    const isImageCropped = !(this.state.croppedParameters === null);

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
                {this.state.existingStoredParametersLoaded && (
                  <Crop
                    existingImageParameters={
                      this.state.existingStoredParameters &&
                      this.state.existingStoredParameters
                        .rawImageQueryParameters
                    }
                    onCrop={croppedParameters =>
                      this.handleCroppedParametersReceived(croppedParameters)
                    }
                    imageUrl={this.props.book.coverImage.url}
                    ratio={0.81}
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
