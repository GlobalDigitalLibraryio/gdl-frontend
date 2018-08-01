// @flow

import React from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@material-ui/core';
import { Form } from 'react-final-form';
import {
  fetchImageMetadata,
  fetchStoredParameters,
  patchImageMetadata,
  postStoredParameters
} from '../lib/fetch';
import { handleValidate } from '../lib/metadataValidator';
import type {
  BookDetails,
  ImageMetadata,
  ImageParameters,
  StoredParameters
} from '../types';
import Crop from './Crop';
import { MetadataFormFields } from './MetadataFormFields';

type Props = {
  onCancel: () => void,
  onSave: () => void,
  book: BookDetails
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

    // FixMe: Since the image-api is not exposing any image_id i have to hardcode one for now.
    // See issue https://github.com/GlobalDigitalLibraryio/issues/issues/443
    const imageId = '10001';
    const imageMetadata = await fetchImageMetadata(imageId);

    if (imageMetadata.isOk) {
      console.log(imageMetadata.data);
      this.setState({ imageMetadata: imageMetadata.data });
    }
  };

  handleSave = async (values: Object) => {
    if (this.state.croppedParameters) {
      const imageApiBody = {
        rawImageQueryParameters: this.state.croppedParameters,
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

    console.log(values);
    const payload = {
      language: this.props.book.language.code,
      alttext: values.alttext.alttext,
      origin: values.copyright.origin,
      license: values.copyright.license.license,
      description: values.copyright.license.description,
      caption: values.caption.caption
    };

    // FixMe: See above fixme
    const result = await patchImageMetadata('10001', payload);

    this.props.onSave();
  };

  handleCroppedParametersReceived = (croppedParameters: ImageParameters) => {
    this.setState({ croppedParameters: croppedParameters });
  };

  render() {
    return (
      <div>
        <Dialog open onClose={this.props.onCancel}>
          <DialogTitle>Edit image and metadata</DialogTitle>

          <Form
            initialValues={
              this.state.imageMetadata ? this.state.imageMetadata : {}
            }
            //validate={handleValidate}
            onSubmit={this.handleSave}
            render={({ handleSubmit, pristine, invalid }) => (
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
                  <MetadataFormFields />
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.props.onCancel} color="secondary">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={pristine || invalid}
                    color="primary"
                  >
                    Save
                  </Button>
                </DialogActions>
              </div>
            )}
          />
        </Dialog>
      </div>
    );
  }
}
