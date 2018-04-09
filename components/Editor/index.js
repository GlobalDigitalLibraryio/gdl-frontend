// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { Fragment } from 'react';
import dynamic from 'next/dynamic';

import type { BookDetails, Chapter } from '../../types';
import { saveBook, saveChapter } from '../../fetch';
import { Backdrop } from '../Reader/styledReader';
import Container from '../Container';
import Button from '../Button';

// ReactJson doesn't work on the server, so make sure we lazy load it
const ReactJson = dynamic(import('react-json-view'));

export default class Editor extends React.Component<
  {
    book: BookDetails,
    chapter?: Chapter
  },
  { isSaving: boolean, book: BookDetails, chapter: ?Chapter }
> {
  state = {
    isSaving: false,
    book: this.props.book,
    chapter: this.props.chapter
  };

  handleEdit = ({ updated_src }: { updated_src: {} }) => {
    if (this.state.chapter) {
      this.setState({ chapter: updated_src });
    } else {
      this.setState({ book: updated_src });
    }
  };

  handleSave = async () => {
    this.setState({ isSaving: true });
    if (this.state.chapter) {
      saveChapter(this.props.book, this.state.chapter);
    } else {
      saveBook(this.state.book);
    }
    this.setState({ isSaving: false });
  };

  render() {
    return (
      <Fragment>
        <Container px={0} size="large" style={{ backgroundColor: '#fff' }}>
          <Button onClick={this.handleSave} isLoading={this.state.isSaving}>
            Save
          </Button>
          <ReactJson
            onEdit={this.handleEdit}
            src={this.state.chapter || this.state.book}
            name={null}
            enableClipboard={false}
            displayObjectSize={false}
            displayDataTypes={false}
          />
        </Container>
      </Fragment>
    );
  }
}
