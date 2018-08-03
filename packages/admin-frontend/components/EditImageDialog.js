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
  fetchStoredParameters,
  patchImageMetadata,
  postStoredParameters
} from '../lib/fetch';
import type {
  BookDetails,
  ImageMetadata,
  ImageParameters,
  StoredParameters
} from '../types';
import Crop from './Crop';
import MetadataFormFields from './MetadataFormFields';
import { LICENSES } from '../data/licenses';

type Props = {
  onCancel: () => void,
  onSave: () => void,
  book: BookDetails,
  featurePreview: boolean
};

type State = {
  croppedParameters: ?ImageParameters,
  existingStoredParameters: ?StoredParameters,
  existingStoredParametersLoaded: boolean,
  imageMetadata: ?ImageMetadata
};

export default class EditImageDialog extends React.Component<Props, State> {
  state = {
    croppedParameters: null,
    existingStoredParameters: null,
    existingStoredParametersLoaded: false,
    imageMetadata: null
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    await this.fetchStoredParameters();

    if (!this.props.featurePreview) {
      await this.fetchImageMetadata();
    }
  };

  async fetchImageMetadata() {
    // FixMe: Since the image-api is not exposing any image_id i have to hardcode one for now.
    // See issue https://github.com/GlobalDigitalLibraryio/issues/issues/443
    const imageId = '10010';
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

    if (!this.props.featurePreview) {
      if (form.getState().dirty) {
        await this.patchMetadata(values);
      }
    }

    this.props.onSave();
  };

  async patchMetadata(values: Object) {
    // We need to find the description of the selected license
    const descriptionForLicense = LICENSES.find(
      element => element.license === values.copyright.license.license

      // $FlowFixMe
    ).description;

    const payload = {
      language: this.props.book.language.code,
      title: values.title.title,
      copyright: {
        license: {
          license: values.copyright.license.license,
          description: descriptionForLicense
        },
        origin: values.copyright.origin,
        rightsholders: [],
        creators: [],
        processors: []
      },
      alttext: values.alttext.alttext,
      caption: values.caption.caption
    };

    // FixMe: Remove hardcoding
    await patchImageMetadata('10010', payload);
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

    return (
      <Dialog open onClose={this.props.onCancel}>
        <DialogTitle>Edit image and metadata</DialogTitle>

        <Form
          initialValues={
            this.state.imageMetadata ? this.state.imageMetadata : {}
          }
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
                <MetadataFormFields
                  names={{
                    title: 'title.title',
                    alttext: 'alttext.alttext',
                    caption: 'caption.caption',
                    license: 'copyright.license.license',
                    licenseDescription: 'copyright.license.description',
                    origin: 'copyright.origin'
                  }}
                  featurePreview={this.props.featurePreview}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.props.onCancel} color="secondary">
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
