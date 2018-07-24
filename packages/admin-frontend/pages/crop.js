// @flow

import React from 'react';
import Container from '../components/Container';
import Crop from '../components/Crop';
import Layout from '../components/Layout';
import { Typography, Button } from '@material-ui/core';
import type { Context } from '../types';

export default class CropPage extends React.Component<{ imageUrl?: string }> {
  cropper: ?Crop;

  static async getInitialProps({ query }: Context) {
    const imageUrl = query.imageUrl;

    return {
      imageUrl: imageUrl
    };
  }

  render() {
    const imageUrl = this.props.imageUrl;
    return (
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
            <Crop
              imageUrl={imageUrl}
              ratio={2.63}
              ref={instance => {
                this.cropper = instance;
              }}
            />
          )}

          {imageUrl && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                this.cropper && this.cropper.postToImageApi();
              }}
            >
              Crop image
            </Button>
          )}
        </Container>
      </Layout>
    );
  }
}
