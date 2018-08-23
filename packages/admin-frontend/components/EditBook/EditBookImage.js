// @flow
import * as React from 'react';
import { ImageOutlined as ImageIcon } from '@material-ui/icons';
import { Button } from '@material-ui/core';
import type { BookDetails } from '../../types';
import EditImageDialog from '../EditImageDialog';

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
    const book = this.props.book;
    return (
      <>
        <div css={{ textAlign: 'center' }}>
          <img
            src={
              // Adds the storedRatio parameter to get the latest crop-parameters of the cover image.
              // The timestamp parameter needs to be added to cache bust the CDN.
              book.coverImage.url +
              '?storedRatio=0.81&focalX=50&focalY=50&ratio=0.81&timestamp=' +
              Date.now()
            }
            alt="Cover"
            width={260}
            height={365}
          />

          <Button onClick={this.handleOpen} size="small">
            <ImageIcon /> Edit book cover
          </Button>
        </div>
        {this.state.dialogOpen && (
          <EditImageDialog
            onClose={this.handleOnCancel}
            book={this.props.book}
          />
        )}
      </>
    );
  }
}
