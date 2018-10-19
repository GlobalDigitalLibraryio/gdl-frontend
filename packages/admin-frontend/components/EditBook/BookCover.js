// @flow
import * as React from 'react';
import { ImageOutlined as ImageIcon } from '@material-ui/icons';
import { imageUrl } from 'gdl-image';
import { Button, Typography } from '@material-ui/core';
import type { BookDetails } from '../../types';
import EditBookCoverDialog from './EditBookCoverDialog';

type Props = {
  book: BookDetails
};

type State = {
  dialogOpen: boolean
};

export default class EditBookImage extends React.Component<Props, State> {
  state = {
    dialogOpen: false
  };

  handleOnCancel = () => {
    this.setState({ dialogOpen: false });
  };

  handleOpen = () => {
    this.setState({ dialogOpen: true });
  };

  render() {
    const coverImage = this.props.book.coverImage;

    if (!coverImage) return null;

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
            alt={coverImage.alttext}
          />
          <Typography variant="caption" gutterBottom>
            Alt: {coverImage.alttext && <em>{coverImage.alttext}</em>}
          </Typography>

          <Button onClick={this.handleOpen} size="small">
            <ImageIcon /> Edit book cover
          </Button>
        </div>
        {this.state.dialogOpen && (
          <EditBookCoverDialog
            onClose={this.handleOnCancel}
            coverImage={coverImage}
          />
        )}
      </>
    );
  }
}
