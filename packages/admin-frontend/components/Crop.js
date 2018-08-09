// @flow

import React, { Component } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { parseQuery } from '../lib/parseQuery';
import type { ImageParameters } from '../types';

type Props = {
  imageUrl: string,
  ratio: number,
  onCrop: (croppedParameters: ImageParameters) => void,
  existingImageParameters: ?ImageParameters
};

export default class Crop extends Component<Props> {
  static defaultProps = {
    existingImageParameters: null
  };

  // Cheat here so Flow doesn't complain. Will use ref API once we upgrade Flow anyways
  cropper: any;
  firstCrop: boolean = true;

  toPercentages = (cropper: any) => {
    const data = cropper.getData();
    return {
      cropStartX: Math.max(
        0,
        Math.round((data.x / cropper.getImageData().naturalWidth) * 100)
      ),
      cropEndX: Math.min(
        100,
        Math.round(
          ((data.x + data.width) / cropper.getImageData().naturalWidth) * 100
        )
      ),
      cropStartY: Math.max(
        0,
        Math.round((data.y / cropper.getImageData().naturalHeight) * 100)
      ),

      cropEndY: Math.min(
        100,
        Math.round(
          ((data.y + data.height) / cropper.getImageData().naturalHeight) * 100
        )
      )
    };
  };

  crop = () => {
    // We skip the callback if it is the first time we crop because the cropper-data (this.cropper.getData()) will be off by a tiny fraction of the input values we set in onReady().
    if (this.firstCrop) {
      this.firstCrop = false;
      return;
    }

    const croppedParametersInPercent = this.toPercentages(this.cropper);
    this.props.onCrop(croppedParametersInPercent);
  };

  existingParametersToCropData = (existingParameters: ImageParameters) => {
    const imageWidth = this.cropper.getImageData().naturalWidth;
    const imageHeight = this.cropper.getImageData().naturalHeight;
    return {
      x: imageWidth * (existingParameters.cropStartX / 100),
      y: imageHeight * (existingParameters.cropStartY / 100),
      width:
        imageWidth *
        ((existingParameters.cropEndX - existingParameters.cropStartX) / 100),
      height:
        imageHeight *
        ((existingParameters.cropEndY - existingParameters.cropStartY) / 100)
    };
  };

  onReady = () => {
    const imageUrl = this.props.imageUrl;

    if (imageUrl.includes('?')) {
      const queryParameters = imageUrl.substring(imageUrl.indexOf('?') + 1);
      const parameters = parseQuery(queryParameters);

      if (equalToImageParameterType(parameters)) {
        // $FlowFixMe
        const data = this.existingParametersToCropData(parameters);
        if (data) {
          this.cropper.setData(data);
        }
      }
    } else {
      const data =
        this.props.existingImageParameters &&
        this.existingParametersToCropData(this.props.existingImageParameters);
      if (data) {
        this.cropper.setData(data);
      }
    }
  };

  render() {
    const imageUrl = this.props.imageUrl;

    return (
      <Cropper
        ref={c => {
          this.cropper = c;
        }}
        style={{ height: 400, width: '100%' }}
        src={
          imageUrl.includes('?')
            ? imageUrl.substring(0, imageUrl.indexOf('?'))
            : imageUrl
        }
        aspectRatio={this.props.ratio}
        guides={false}
        viewMode={2}
        zoomable={false}
        dragMode={'move'}
        crop={this.crop}
        ready={this.onReady}
      />
    );
  }
}

function equalToImageParameterType(parameters: {}) {
  const keys = Object.keys(parameters);
  const values = Object.values(parameters);

  return (
    keys.includes('cropStartX') &&
    keys.includes('cropEndX') &&
    keys.includes('cropStartY') &&
    keys.includes('cropEndY') &&
    values.every(value => typeof value === 'number')
  );
}
