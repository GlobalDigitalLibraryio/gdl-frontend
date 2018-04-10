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
import A from '../A';
import { Link } from '../../routes';
import Heading from '../Heading';
import { saveBook, saveChapter } from '../../fetch';
import Container from '../Container';

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

  handleEdit = ({ updated_src }: { updated_src: BookDetails | Chapter }) => {
    if (this.state.chapter) {
      // $FlowFixMe
      this.setState({ chapter: updated_src });
    } else {
      // $FlowFixMe
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
    const { book } = this.props;
    return (
      <Fragment>
        <Container px={0} size="large">
          <Heading>
            Editing book:{' '}
            <Link
              route="book"
              params={{ lang: book.language.code, id: book.id }}
              passHref
            >
              <A>{book.title}</A>
            </Link>
          </Heading>
          {this.props.chapter && (
            <Heading size={2}>
              Chapter:{' '}
              <Link
                route="read"
                params={{
                  lang: book.language.code,
                  id: book.id,
                  chapterId: this.props.chapter.id
                }}
                passHref
              >
                <A>{this.props.chapter.seqNo}</A>
              </Link>
            </Heading>
          )}
          <button onClick={this.handleSave} disabled={this.state.isSaving}>
            Save
          </button>
          <button onClick={this.handleSave} disabled={this.state.isSaving}>
            Save and close
          </button>
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
