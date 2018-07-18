// @flow
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button
} from '@material-ui/core';

import * as React from 'react';
import styled from 'react-emotion';
import { Edit as EditIcon } from '@material-ui/icons';
import { EditIconButton } from '../../style/icons';
import type { BookDetails } from '../../types';
import colors from '../../style/colors';
import Crop from '../Crop';
type State = {
  open: boolean
};

type Props = {
  book: BookDetails
};

export default class EditBookImage extends React.Component<Props, State> {
  state = {
    open: false
  };

  cropInstance: ?Crop;

  componentWillUnmount() {
    this.cropInstance = null;
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const book = this.props.book;
    return (
      <div>
        <div
          css={{
            display: 'inline-block',
            position: 'relative',
            marginRight: 16
          }}
        >
          <img
            src={
              book.coverImage.url +
              '?storedRatio=0.81&ratio=0.81&focalX=50&focalY=50' +
              '&timestamp=' +
              Date.now()
            }
            css=""
            alt="Cover"
            width={260}
            height={365}
          />

          <EditIconButton title="Edit cover image" onClick={this.handleOpen}>
            <EditIcon />
          </EditIconButton>
        </div>

        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle>Crop image</DialogTitle>
          <DialogContent>
            <div>
              <Crop
                ref={instance => {
                  this.cropInstance = instance;
                }}
                imageUrl={book.coverImage.url}
                ratio={0.81}
              />
            </div>
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>

            <Button
              color="primary"
              onClick={() => {
                this.cropInstance && this.cropInstance.handleSave();
                this.handleClose();
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
