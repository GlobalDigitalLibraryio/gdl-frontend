// @flow

import React from 'react';

type State = {
  imageError: boolean
};

type Props = {
  imageUrl: string
};

export default class CropImageViewer extends React.Component<Props, State> {
  state = {
    imageError: false,
    dialogOpen: false
  };

  handleImageError = () => {
    this.setState({ imageError: true });
  };

  handleImageLoad = () => {
    this.setState({ imageError: false });
  };

  render() {
    return (
      <div css={{ position: 'relative' }}>
        <img
          width="100%"
          onError={this.handleImageError}
          onLoad={this.handleImageLoad}
          alt="Featured content"
          src={this.props.imageUrl}
        />
      </div>
    );
  }
}
