// @flow
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button
} from '@material-ui/core';

import * as React from 'react';
import { Edit as EditIcon } from '@material-ui/icons';
import { fetchStoredParameters, postStoredParameters } from '../../lib/fetch';

import { EditIconButton } from '../../style/icons';
import type {
  BookDetails,
  ImageParameters,
  StoredParameters
} from '../../types';
import Crop from '../Crop';

type State = {
  open: boolean,
  croppedParameters: ?ImageParameters,
  existingStoredParameters: ?StoredParameters
};

type Props = {
  book: BookDetails
};

export default class EditBookImage extends React.Component<Props, State> {
  state = {
    open: false,
    croppedParameters: null,
    existingStoredParameters: null
  };

  handleOpen = async () => {
    this.setState({ open: true });

    const storedParameters = await fetchStoredParameters(
      this.props.book.coverImage.url.substring(
        this.props.book.coverImage.url.lastIndexOf('/')
      )
    );

    if (storedParameters.isOk) {
      this.setState({ existingStoredParameters: storedParameters.data[0] });
    } else {
      this.setState({ existingStoredParameters: null });
    }
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSave = async () => {
    if (this.state.croppedParameters) {
      const imageApiBody = {
        rawImageQueryParameters: this.state.croppedParameters,
        forRatio: '0.81',
        revision: this.state.existingStoredParameters
          ? this.state.existingStoredParameters.revision
          : 1,
        imageUrl: this.props.book.coverImage.url.substring(
          this.props.book.coverImage.url.lastIndexOf('/')
        )
      };

      const result = await postStoredParameters(imageApiBody);

      if (result.isOk) {
        this.setState({ existingStoredParameters: result.data });
      }
    }

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
          <img
            src={
              book.coverImage.url + '?storedRatio=0.81&timestamp=' + Date.now()
            }
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
                passCroppedParameters={croppedParameters =>
                  this.handleCroppedParametersReceived(croppedParameters)
                }
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
                this.handleClose();
                this.handleSave();
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  handleCroppedParametersReceived = (croppedParameters: ImageParameters) => {
    this.setState({ croppedParameters: croppedParameters });
  };
}
