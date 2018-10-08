// @flow

import React, { Component } from 'react';
import ReactCropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import type { ImageCropCoordinates } from '../../types';

type Props = {
  imageUrl: string,
  aspectRatio: 0.81 | 2.63, // Book covers and featured content respectively
  onCrop: (data: ImageCropCoordinates) => void,
  cropCoordinates: ?ImageCropCoordinates
};

export default class Cropper extends Component<Props> {
  cropper = React.createRef();

  handleCrop = () => {
    const cropData = this.cropper.current.getData(true /* rounded values*/);
    this.props.onCrop({
      topLeftX: cropData.x,
      topLeftY: cropData.y,
      width: cropData.width,
      height: cropData.height,
      ratio: this.props.aspectRatio.toString(),
      revision: this.props.cropCoordinates
        ? this.props.cropCoordinates.revision
        : 1
    });
  };

  handleReady = () => {
    const { cropCoordinates } = this.props;

    if (cropCoordinates) {
      this.cropper.current.setData({
        x: cropCoordinates.topLeftX,
        y: cropCoordinates.topLeftY,
        width: cropCoordinates.width,
        height: cropCoordinates.height
      });
    }
  };

  render() {
    const imageUrl = this.props.imageUrl;

    return (
      <ReactCropper
        ref={this.cropper}
        style={{ height: 400, width: '100%' }}
        src={imageUrl}
        aspectRatio={this.props.aspectRatio}
        guides={false}
        viewMode={2}
        zoomable={false}
        dragMode={'move'}
        crop={this.handleCrop}
        ready={this.handleReady}
      />
    );
  }
}
