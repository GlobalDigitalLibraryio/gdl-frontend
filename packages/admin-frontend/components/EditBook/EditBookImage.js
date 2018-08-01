// @flow

import * as React from 'react';
import { Edit as EditIcon } from '@material-ui/icons';
import { EditIconButton } from '../../style/icons';
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
              // Adds the storedRatio parameter to get the latest crop-parameters of the cover image.
              // The timestamp parameter needs to be added to cache bust the CDN.
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

        {this.state.dialogOpen && (
          <EditImageDialog
            onCancel={() => this.handleOnCancel()}
            onSave={() => this.handleOnCancel()}
            book={this.props.book}
          />
        )}
      </div>
    );
  }
}
