// @flow
import * as React from 'react';
import { ImageOutlined as ImageIcon } from '@material-ui/icons';
import { imageUrl } from 'gdl-image';
import { Button, Typography } from '@material-ui/core';
import { fetchImageMetadata } from '../../lib/fetch';
import type { BookDetails, ImageMetadata } from '../../types';
import EditBookCoverDialog from './EditBookCoverDialog';

type Props = {
  book: BookDetails
};

type State = {
  dialogOpen: boolean,
  imageMetadata: ?ImageMetadata
};

export default class EditBookImage extends React.Component<Props, State> {
  state = {
    dialogOpen: false,
    imageMetadata: null
  };

  componentDidMount() {
    this.getImageData();
  }

  async getImageData() {
    if (!this.props.book.coverImage) return;

    const result = await fetchImageMetadata(this.props.book.coverImage.imageId);

    if (result.isOk) {
      this.setState({ imageMetadata: result.data });
    }
  }

  handleSave = () => {
    this.getImageData();
    this.setState({ dialogOpen: false });
  };

  handleCancel = () => this.setState({ dialogOpen: false });

  render() {
    if (!this.props.book.coverImage) {
      return null;
    }

    const { imageMetadata } = this.state;

    // While we're waiting for the imageApi to respond with the metadata, we use the stuff we know from the book object
    const altText = imageMetadata
      ? imageMetadata.alttext.alttext
      : this.props.book.coverImage.alttext;

    const coverImage = imageMetadata
      ? {
          url: imageMetadata.imageUrl,
          imageId: imageMetadata.id,
          variants: imageMetadata.imageVariants,
          alttext: altText
        }
      : this.props.book.coverImage;

    return (
      <>
        <div css={{ textAlign: 'center' }}>
          <img
            src={imageUrl(coverImage, { aspectRatio: 0.81 })}
            css={{
              width: 310,
              height: 380,
              objectFit: 'cover',
              objectPosition: 'center center'
            }}
            alt={altText}
          />
          <Typography variant="caption" gutterBottom>
            Alt: {altText && <em>{altText}</em>}
          </Typography>

          <Button
            onClick={() => this.setState({ dialogOpen: true })}
            size="small"
          >
            <ImageIcon /> Edit book cover
          </Button>
        </div>
        {this.state.dialogOpen &&
          imageMetadata && (
            <EditBookCoverDialog
              onCancel={this.handleCancel}
              onSave={this.handleSave}
              imageMetadata={imageMetadata}
            />
          )}
      </>
    );
  }
}
