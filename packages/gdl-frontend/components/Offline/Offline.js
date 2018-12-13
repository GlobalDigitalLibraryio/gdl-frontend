// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Snackbar } from '@material-ui/core';
import offlineLibrary from '../../lib/offlineLibrary';
import { logEvent } from '../../lib/analytics';

type Props = {
  children: (data: {
    offlined: boolean,
    downloading: boolean,
    onClick: () => Promise<void>
  }) => React.Node,
  book: $ReadOnly<{
    id: string,
    title: string
  }>
};

export default class Offline extends React.Component<
  Props,
  { offlined: boolean, downloading: boolean, snackbarMessage: ?string }
> {
  state = {
    downloading: false,
    snackbarMessage: null,
    offlined: false
  };

  async componentDidMount() {
    if (!offlineLibrary) return;
    this.setState({
      offlined: Boolean(await offlineLibrary.getBook(this.props.book.id))
    });
  }

  async componentDidUpdate(prevProps: Props) {
    if (prevProps.book.id !== this.props.book.id && offlineLibrary) {
      this.setState({
        downloading: false,
        offlined: Boolean(await offlineLibrary.getBook(this.props.book.id))
      });
    }
  }

  addOffline = async () => {
    if (!offlineLibrary) return;

    this.setState({ downloading: true });
    const offlined = await offlineLibrary.addBook(this.props.book.id);
    if (offlined) {
      this.setState({
        offlined,
        downloading: false,
        snackbarMessage: 'Added book to your offline library.'
      });
      logEvent('Books', 'Available offline', this.props.book.title);
    } else {
      this.setState({
        downloading: false,
        snackbarMessage:
          'An error occurred while adding this book to your offline library.'
      });
    }
  };

  removeOffline = async () => {
    if (!offlineLibrary) return;

    await offlineLibrary.deleteBook(this.props.book.id);
    this.setState({
      offlined: false,
      snackbarMessage: 'Removed book from your offline library.'
    });
    logEvent('Books', 'Remove offline', this.props.book.title);
  };

  render() {
    const { offlined, downloading, snackbarMessage } = this.state;
    return (
      <>
        {this.props.children({
          offlined,
          downloading,
          onClick: offlined ? this.removeOffline : this.addOffline
        })}
        <Snackbar
          autoHideDuration={3000}
          open={Boolean(snackbarMessage)}
          onClose={() => this.setState({ snackbarMessage: null })}
          ContentProps={{
            'aria-describedby': 'offline-snack-msg'
          }}
          message={<span id="offline-snack-msg">{snackbarMessage}</span>}
        />
      </>
    );
  }
}
