// @flow

import React, { Component } from 'react';
import Cropper from 'react-cropper';
import fetch from 'isomorphic-fetch';
import { getAuthToken } from 'gdl-auth';
import 'cropperjs/dist/cropper.css';
import Container from '../components/Container';
import Layout from '../components/Layout';
import { Typography, Button } from '@material-ui/core';

import { imageApiUrl } from '../config';

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

  // Cheat here so Flow doesn't complain. Will use ref API once we upgrade Flow anyways
  cropper: any;

  componentDidMount() {
    this.getExistingParameters();
  }

  toPercentages = c => {
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
      this.setState({ postResult: 'Posting…' });
      const authToken = getAuthToken();
      const response = await fetch(`${imageApiUrl}/images/stored-parameters`, {
        method: 'POST',
        headers: {
          Authorization: authToken ? `Bearer ${authToken}` : null,
          Accept: 'application/json'
        },
        body: JSON.stringify(this.state.imageApiBody)
      });

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
      imageUrl && `${imageApiUrl}/images/stored-parameters${imageUrl}`;
    const response = await fetch(url);
    if (response.status === 200) {
      this.setState({ existingParameters: await response.json() });
    } else {
      this.setState({ existingParameters: null });
    }
  };

  toggleRatio = e => {
    e.preventDefault();
    if (this.state.ratio === 0.81) {
      this.setState({ ratio: 2.63 });
    } else {
      this.setState({ ratio: 0.81 });
    }
    this.getExistingParameters();
    this.cropper.replace(this.props.imageUrl);
  };

  displayPostResult() {
    if (this.state.postResult !== null) {
      return <p>{this.state.postResult}</p>;
    } else {
      return null;
    }
  }

  existingParametersToCropData = ps => {
    const p = ps && ps.find(x => x.forRatio === String(this.state.ratio));
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
      <div>
        <p>
          <Button color="primary" onClick={this.toggleRatio}>
            Toggle ratio
          </Button>
        </p>
        <Cropper
          ref={c => {
            this.cropper = c;
          }}
          src={this.props.imageUrl}
          aspectRatio={this.state.ratio}
          guides={false}
          viewMode={2}
          zoomable={false}
          dragMode={'move'}
          preview={'.preview'}
          crop={this.crop}
          ready={this.onReady}
        />
        <p
          className="preview"
          style={{ overflow: 'hidden', height: 400, width: 400 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={this.postToImageApi}
        >
          Save this crop config for ratio={this.state.ratio}
        </Button>
        {this.displayPostResult()}
      </div>
    );
  }
}

const CropPage = ({ imageUrl }: { imageUrl?: string }) => (
  <Layout>
    <Container>
      <Typography variant="headline" component="h1" gutterBottom>
        Crop
      </Typography>
      {imageUrl == null ? (
        <Typography variant="subheading">
          You need to specify <code>imageUrl</code> in the URL
        </Typography>
      ) : (
        <Crop imageUrl={imageUrl} />
      )}
    </Container>
  </Layout>
);

CropPage.getInitialProps = context => {
  const imageUrl = context.query.imageUrl;

  return {
    imageUrl
  };
};

export default CropPage;
