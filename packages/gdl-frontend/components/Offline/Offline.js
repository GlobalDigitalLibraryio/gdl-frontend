// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { injectIntl, defineMessages } from 'react-intl';
import { Snackbar } from '@material-ui/core';
import offlineLibrary from '../../lib/offlineLibrary';
import { logEvent } from '../../lib/analytics';
import type { IntlShape } from 'react-intl';

const snackbarMessages = defineMessages({
  add: {
    id: 'Added book to your offline library',
    defaultMessage: 'Added book to your offline library.'
  },
  error: {
    id: 'An error occurred while adding this book to your offline library',
    defaultMessage:
      'An error occurred while adding this book to your offline library.'
  },
  remove: {
    id: 'Removed book from your offline library',
    defaultMessage: 'Removed book from your offline library.'
  }
});

type Props = {
  children: (data: {
    offlined: boolean,
    downloading: boolean,
    onClick: () => Promise<void>
  }) => React.Node,
  book: $ReadOnly<{
    id: string,
    title: string
  }>,
  intl: IntlShape
};

class Offline extends React.Component<
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
        snackbarMessage: this.props.intl.formatMessage(snackbarMessages.add)
      });
      logEvent('Books', 'Available offline', this.props.book.title);
    } else {
      this.setState({
        downloading: false,
        snackbarMessage: this.props.intl.formatMessage(snackbarMessages.error)
      });
    }
  };

  removeOffline = async () => {
    if (!offlineLibrary) return;

    await offlineLibrary.deleteBook(this.props.book.id);
    this.setState({
      offlined: false,
      snackbarMessage: this.props.intl.formatMessage(snackbarMessages.remove)
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
          message={
            <span data-cy="save-offline-snackbar" id="offline-snack-msg">
              {snackbarMessage}
            </span>
          }
        />
      </>
    );
  }
}

export default injectIntl(Offline);
