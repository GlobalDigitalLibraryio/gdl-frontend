// @flow

import React from 'react';
import 'cropperjs/dist/cropper.css';
import Container from '../components/Container';
import Crop from '../components/EditBook/Crop';
import Layout from '../components/Layout';
import { Typography } from '@material-ui/core';

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
        <Crop imageUrl={imageUrl} ratio={0.81} />
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
