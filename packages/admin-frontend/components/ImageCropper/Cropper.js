// @flow

import React from 'react';
import ReactCropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import type { ImageCropCoordinates } from '../../types';

type Props = {
  imageUrl: string,
  aspectRatio: 0.81 | 2.63, // Book covers and featured content respectively
  onCrop: (data: ImageCropCoordinates) => void,
  cropCoordinates: ?ImageCropCoordinates
};

export default class Cropper extends React.Component<Props> {
  cropper: { current: any } = React.createRef();
  cropData: ?{
    x: number,
    y: number,
    width: number,
    height: number
  };
  ready = false;

  componentDidUpdate(prevProps: Props) {
    if (prevProps.cropCoordinates !== this.props.cropCoordinates) {
      this.setCropData();
    }
  }

  setCropData = () => {
    const { cropCoordinates } = this.props;

    if (this.ready && cropCoordinates) {
      this.cropper.current.setData({
        x: cropCoordinates.x,
        y: cropCoordinates.y,
        width: cropCoordinates.width,
        height: cropCoordinates.height
      });
    }
  };

  /**
   * We only want to fire this after we've done cropping instead of continusously
   * So we store the value on the instance
   */
  handleCrop = () => {
    this.cropData = this.cropper.current.getData(true /* rounded values*/);
  };

  handleCropEnd = () => {
    const cropData = this.cropData;
    cropData &&
      this.props.onCrop({
        x: cropData.x,
        y: cropData.y,
        width: cropData.width,
        height: cropData.height,
        ratio: this.props.aspectRatio.toString(),
        revision: this.props.cropCoordinates
          ? this.props.cropCoordinates.revision
          : 1
      });
  };

  render() {
    return (
      <ReactCropper
        ref={this.cropper}
        style={{ height: 400, width: '100%' }}
        src={this.props.imageUrl}
        aspectRatio={this.props.aspectRatio}
        guides={false}
        viewMode={2}
        zoomable={false}
        dragMode="move"
        crop={this.handleCrop}
        cropend={this.handleCropEnd}
        ready={() => {
          this.ready = true;
          this.setCropData();
        }}
      />
    );
  }
}
