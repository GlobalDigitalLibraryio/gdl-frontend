// @flow
import { render } from 'react-dom';

import React, { Component } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import Link from 'next/link';
import fetch from 'isomorphic-fetch';
import { imageApiUrl } from '../config';
import { getTokenFromLocalCookie } from '../lib/fetch';

type Props = {
  imageUrl?: string
};

type State = {
  ratio: number,
  imageApiBody?: any,
  existingParameters?: any,
  postResult?: string
};

class Crop extends Component<Props, State> {
  state = { ratio: 0.81, imageApiBody: null, existingParameters: null };

  toPercentages = c => {
    var cropStartPxX = c.getCropBoxData().left - c.getCanvasData().left;
    var cropEndPxX = cropStartPxX + c.getCropBoxData().width;
    var cropStartPxY = c.getCropBoxData().top - c.getCanvasData().top;
    var cropEndPxY = cropStartPxY + c.getCropBoxData().height;

    return {
      cropStartX: Math.max(
        0,
        Math.round((cropStartPxX / c.getImageData().naturalWidth) * 100)
      ),
      cropEndX: Math.min(
        100,
        Math.round((cropEndPxX / c.getImageData().naturalWidth) * 100)
      ),
      cropStartY: Math.max(
        0,
        Math.round((cropStartPxY / c.getImageData().naturalHeight) * 100)
      ),

      cropEndY: Math.min(
        100,
        Math.round((cropEndPxY / c.getImageData().naturalHeight) * 100)
      )
    };
  };

  toImageApiBody = pcnt => {
    const existingParametersForCurrentRatio =
      this.state.existingParameters &&
      this.state.existingParameters.find(
        p => p.forRatio === String(this.state.ratio)
      );
    const revision =
      (existingParametersForCurrentRatio &&
        existingParametersForCurrentRatio.revision) ||
      1;

    return {
      forRatio: String(this.state.ratio),
      revision: revision,
      imageUrl: this.props.imageUrl && this.props.imageUrl.substr(this.props.imageUrl.lastIndexOf('/')),
      rawImageQueryParameters: {
        cropStartX: pcnt.cropStartX,
        cropEndX: pcnt.cropEndX,
        cropStartY: pcnt.cropStartY,
        cropEndY: pcnt.cropEndY
      }
    };
  };

  _crop() {
    var pcnt = this.toPercentages(this.refs.cropper);
    var url =
      this.props.imageUrl &&
      `${this.props.imageUrl.toString()}?cropStartX=${
        pcnt.cropStartX
      }&cropEndX=${pcnt.cropEndX}&cropStartY=${pcnt.cropStartY}&cropEndY=${
        pcnt.cropEndY
      }`;

    this.setState({ imageApiBody: this.toImageApiBody(pcnt) });
  }

  postToImageApi = async _ => {
    if (this.state.imageApiBody !== null) {
      this.setState({ postResult: 'Posting…' });
      const response = await fetch(`${imageApiUrl}/images/stored-parameters`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + getTokenFromLocalCookie(),
          Accept: 'application/json'
        },
        body: JSON.stringify(this.state.imageApiBody)
      });

      let result = await response.json();

      if (response.ok) {
        this.setState({ postResult: 'Ok!' });
      } else if (response.status === 401) {
        this.setState({ postResult: 'Unauthorized, please login' });
      } else {
        this.setState({ postResult: `Unknown error: ${response.status}` });
      }
      await this.getExistingParameters();
    }
  };

  getExistingParameters = async () => {
    const imageUrl =
      this.props.imageUrl &&
      this.props.imageUrl.substr(this.props.imageUrl.lastIndexOf('/'));
    const url =
      imageUrl &&
      `${imageApiUrl}/images/stored-parameters${imageUrl.toString()}`;
    const response = await fetch(url);
    this.setState({ existingParameters: await response.json() });
  };

  toggleRatio = e => {
    e.preventDefault();
    if (this.state.ratio === 0.81) {
      this.setState({ ratio: 2.63 });
    } else {
      this.setState({ ratio: 0.81 });
    }
  };

  componentDidMount() {
    this.getExistingParameters();
  }

  displayPostResult() {
    if (this.state.postResult !== null) {
      return <p>{this.state.postResult}</p>;
    } else {
      return null;
    }
  }

  render() {
    return (
      <div>
        <p>
          <button onClick={this.toggleRatio}>Toggle ratio</button>
        </p>
        <Cropper
          ref="cropper"
          src={this.props.imageUrl}
          aspectRatio={this.state.ratio}
          guides={false}
          viewMode={2}
          zoomable={false}
          dragMode={'move'}
          preview={'.preview'}
          crop={this._crop.bind(this)}
        />
        <p
          className="preview"
          style={{ overflow: 'hidden', height: 400, width: 400 }}
        />
        <button onClick={this.postToImageApi}>
          Save this crop config for ratio={this.state.ratio}
        </button>
        {this.displayPostResult()}
      </div>
    );
  }
}

const CropPage = ({ imageUrl }: { imageUrl?: string }) => (
  <div>
    <h1>Crop</h1>
    {imageUrl == null ? (
      <p>
        You need to specify <tt>imageUrl</tt> in the URL
      </p>
    ) : (
      <Crop imageUrl={imageUrl} />
    )}
  </div>
);

CropPage.getInitialProps = context => {
  const imageUrl = context.query.imageUrl;

  return {
    imageUrl
  };
};

export default CropPage;
