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

// Only allow these fields to be edited
const EDITABLE_CHAPTER_FIELDS = ['content', 'chapterType'];
const EDITABLE_BOOK_FIELDS = ['title', 'description', 'pageOrientation'];

export default class Editor extends React.Component<
  {
    book: BookDetails,
    chapter?: Chapter
  },
  { isSaving: boolean, book: BookDetails, didSave: boolean, chapter: ?Chapter }
> {
  state = {
    isSaving: false,
    didSave: false,
    book: this.props.book,
    chapter: this.props.chapter
  };

  handleChapterEdit = (edit: {
    name: string,
    new_value: string,
    updated_src: Chapter
  }) => {
    if (!edit.new_value || !EDITABLE_CHAPTER_FIELDS.includes(edit.name)) {
      return false;
    }
    this.setState({ chapter: edit.updated_src, didSave: false });
  };

  handleBookEdit = (edit: {
    name: string,
    new_value: string,
    updated_src: BookDetails
  }) => {
    if (!edit.new_value || !EDITABLE_BOOK_FIELDS.includes(edit.name)) {
      return false;
    }
    this.setState({ book: edit.updated_src, didSave: false });
  };

  handleSave = async () => {
    this.setState({ isSaving: true });
    if (this.state.chapter) {
      saveChapter(this.props.book, this.state.chapter);
    } else {
      saveBook(this.state.book);
    }
    this.setState({ isSaving: false, didSave: true });
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
              Editing chapter:{' '}
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

          <div style={{ textAlign: 'right' }}>
            {this.state.didSave && <span>Saved changes!</span>}
            <Link
              route={this.props.chapter ? 'read' : 'book'}
              params={{
                lang: book.language.code,
                id: book.id,
                chapterId: this.props.chapter
                  ? this.props.chapter.id
                  : undefined
              }}
            >
              <button
                disabled={this.state.isSaving}
                style={{ margin: '0 1rem' }}
              >
                Discard changes
              </button>
            </Link>
            <button onClick={this.handleSave} disabled={this.state.isSaving}>
              Save changes
            </button>
          </div>

          <ReactJson
            onEdit={
              this.state.chapter ? this.handleChapterEdit : this.handleBookEdit
            }
            collapsed={1}
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
