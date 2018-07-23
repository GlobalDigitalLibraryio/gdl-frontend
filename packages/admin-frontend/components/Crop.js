// @flow

import React, { Component } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import type { ImageParameters } from '../pages/featured';

type Props = {
  imageUrl: string,
  ratio: number,
  passCroppedParameters: (imageApiBody: any) => void
};

type State = {
  existingParameters: ?ImageParameters,
  imageUrl: string
};

export default class Crop extends Component<Props, State> {
  state = {
    existingParameters: null,
    imageUrl: ''
  };

  // Cheat here so Flow doesn't complain. Will use ref API once we upgrade Flow anyways
  cropper: any;

  componentDidMount() {
    const imageUrl = this.props.imageUrl;

    if (imageUrl.includes('?')) {
      const baseUrl = imageUrl.substring(0, imageUrl.indexOf('?'));
      const queryParameters = imageUrl.substring(imageUrl.indexOf('?') + 1);

      const parameters = parseQuery(queryParameters);

      // $FlowFixMe
      this.setState({ imageUrl: baseUrl, existingParameters: parameters });
    } else {
      this.setState({ imageUrl: imageUrl, existingParameters: null });
    }
  }

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
    const croppedParametersInPercent = this.toPercentages(this.cropper);
    this.props.passCroppedParameters(croppedParametersInPercent);
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
    const data =
      this.state.existingParameters &&
      this.existingParametersToCropData(this.state.existingParameters);

    if (data !== null) {
      this.cropper.setData(data);
    }
  };

  render() {
    return (
      <Cropper
        ref={c => {
          this.cropper = c;
        }}
        style={{ height: 400, width: '100%' }}
        src={this.state.imageUrl}
        aspectRatio={this.props.ratio}
        guides={false}
        viewMode={2}
        zoomable={false}
        dragMode={'move'}
        // todo: remove this
        preview={'.preview'}
        crop={this.crop}
        ready={this.onReady}
      />
    );
  }
}

function parseQuery(queryString) {
  const query = {};
  const pairs = (queryString[0] === '?'
    ? queryString.substr(1)
    : queryString
  ).split('&');
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
}
