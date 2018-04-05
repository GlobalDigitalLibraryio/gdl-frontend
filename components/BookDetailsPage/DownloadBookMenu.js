// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { Trans } from '@lingui/react';

import type { BookDetails } from '../../types';
import Menu, { MenuItem } from '../Menu';

type Props = {
  book: BookDetails,
  onClose: (
    event: | SyntheticMouseEvent<any>
    | SyntheticKeyboardEvent<any>
    | KeyboardEvent
  ) => void
};

export default class DownloadBookMenu extends React.Component<Props> {
  render() {
    const { book, onClose } = this.props;

    return (
      <Menu
        heading={<Trans>Download book</Trans>}
        onClose={onClose}
        isCentered
        hasTintedBackground
      >
        {book.downloads.epub && (
          <MenuItem
            href={book.downloads.epub}
            showKeyLine={Boolean(book.downloads.pdf)}
          >
            <Trans>E-book (ePUB)</Trans>
          </MenuItem>
        )}
        {book.downloads.pdf && (
          <MenuItem href={book.downloads.pdf}>
            <Trans>Printable book (PDF)</Trans>
          </MenuItem>
        )}
      </Menu>
    );
  }
}
