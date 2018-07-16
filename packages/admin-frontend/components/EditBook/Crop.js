// @flow

import React, { Component } from 'react';
import Cropper from 'react-cropper';
import fetch from 'isomorphic-fetch';
import { getAuthToken } from '../../../../packages/gdl-auth/index';
import 'cropperjs/dist/cropper.css';

import { imageApiUrl } from '../../config';

type Props = {
  imageUrl?: string,
  ratio: number
};

type State = {
  imageApiBody?: any,
  existingParameters?: any
};

export default class Crop extends Component<Props, State> {
  state = { imageApiBody: null, existingParameters: null };

  // Cheat here so Flow doesn't complain. Will use ref API once we upgrade Flow anyways
  cropper: any;

  componentDidMount() {
    this.getExistingParameters();
  }

  toPercentages = (c: any) => {
    const data = c.getData();
    return {
      cropStartX: Math.max(
        0,
        Math.round((data.x / c.getImageData().naturalWidth) * 100)
      ),
      cropEndX: Math.min(
        100,
        Math.round(
          ((data.x + data.width) / c.getImageData().naturalWidth) * 100
        )
      ),
      cropStartY: Math.max(
        0,
        Math.round((data.y / c.getImageData().naturalHeight) * 100)
      ),

      cropEndY: Math.min(
        100,
        Math.round(
          ((data.y + data.height) / c.getImageData().naturalHeight) * 100
        )
      )
    };
  };

  toImageApiBody = (pcnt: any) => {
    const existingParametersForCurrentRatio =
      this.state.existingParameters &&
      this.state.existingParameters.find(
        p => p.forRatio === String(this.props.ratio)
      );
    const revision =
      (existingParametersForCurrentRatio &&
        existingParametersForCurrentRatio.revision) ||
      1;

    return {
      forRatio: String(this.props.ratio),
      revision: revision,
      imageUrl:
        this.props.imageUrl &&
        this.props.imageUrl.substr(this.props.imageUrl.lastIndexOf('/')),
      rawImageQueryParameters: {
        cropStartX: pcnt.cropStartX,
        cropEndX: pcnt.cropEndX,
        cropStartY: pcnt.cropStartY,
        cropEndY: pcnt.cropEndY
      }
    };
  };

  crop = () => {
    const pcnt = this.toPercentages(this.cropper);
    this.setState({ imageApiBody: this.toImageApiBody(pcnt) });
  };

  postToImageApi = async () => {
    if (this.state.imageApiBody !== null) {
      const authToken = getAuthToken();
      await fetch(`${imageApiUrl}/images/stored-parameters`, {
        method: 'POST',
        headers: {
          Authorization: authToken ? `Bearer ${authToken}` : null,
          Accept: 'application/json'
        },
        body: JSON.stringify(this.state.imageApiBody)
      });

      await this.getExistingParameters();
    }
  };

  handleSave() {
    this.postToImageApi();
  }

  getExistingParameters = async () => {
    const imageUrl =
      this.props.imageUrl &&
      this.props.imageUrl.substr(this.props.imageUrl.lastIndexOf('/'));
    const url =
      imageUrl && `${imageApiUrl}/images/stored-parameters${imageUrl}`;
    const response = await fetch(url);
    if (response.status === 200) {
      this.setState({ existingParameters: await response.json() });
    } else {
      this.setState({ existingParameters: null });
    }
  };

  existingParametersToCropData = (ps: any) => {
    const p = ps && ps.find(x => x.forRatio === String(this.props.ratio));
    const imageWidth = this.cropper.getImageData().naturalWidth;
    const imageHeight = this.cropper.getImageData().naturalHeight;
    if (p && p.rawImageQueryParameters) {
      const r = p.rawImageQueryParameters;
      return {
        x: imageWidth * (r.cropStartX / 100),
        y: imageHeight * (r.cropStartY / 100),
        width: imageWidth * ((r.cropEndX - r.cropStartX) / 100),
        height: imageHeight * ((r.cropEndY - r.cropStartY) / 100)
      };
    }
  };

  onReady = () => {
    const data = this.existingParametersToCropData(
      this.state.existingParameters
    );
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
        src={this.props.imageUrl}
        aspectRatio={this.props.ratio}
        guides={false}
        viewMode={2}
        zoomable={false}
        dragMode={'move'}
        preview={'.preview'}
        crop={this.crop}
        ready={this.onReady}
      />
    );
  }
}
