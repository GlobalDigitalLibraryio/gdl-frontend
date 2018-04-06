// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import dynamic from 'next/dynamic';
import type { BookDetails, Chapter } from '../../types';

// ReactJson doesn't work on the server, so make sure we lazy load it
const ReactJson = dynamic(import('react-json-view'));

export default class Editor extends React.Component<{
  book: BookDetails,
  chapter?: Chapter
}> {
  handleEdit = lol => {
    console.log(lol);
  };

  render() {
    const { book, chapter } = this.props;
    return (
      <ReactJson
        onEdit={this.handleEdit}
        src={chapter || book}
        name={null}
        enableClipboard={false}
        displayObjectSize={false}
        displayDataTypes={false}
      />
    );
  }
}
