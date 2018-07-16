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
import type { BookDetails } from '../../types';
import BookCover from '../BookCover';
import colors from '../../style/colors';
import Crop from './Crop';
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

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSave = (child: Crop) => {
    child.handleSave();
    this.handleClose();
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
          <BookCover
            coverImage={book.coverImage}
            w={[130, 260]}
            h={[175, 365]}
          />
          <div onClick={this.handleOpen}>
            <EditBookLink>
              <EditIcon />
            </EditBookLink>
          </div>
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
            <Button onClick={this.handleClose}>Cancel</Button>

            <Button
              onClick={child => {
                this.handleSave(child);
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

const EditBookLink = styled('div')`
  color: ${colors.base.white};
  position: absolute;
  top: 0;
  right: 0;
  padding: 5px;
  transition: all 0.3s ease;
  background: rgba(0, 0, 0, 0.5);
  &:hover {
    background: rgba(0, 0, 0, 0.6);
  }
`;
