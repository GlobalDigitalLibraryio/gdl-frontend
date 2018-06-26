// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import type { BookDetails, Chapter, PublishingStatus } from '../../types';
import { saveBook, saveChapter } from '../../lib/fetch';
import Container from '../Container';
import {
  FormControl,
  InputLabel,
  Select,
  Grid,
  Button
} from '@material-ui/core';

// ReactJson doesn't work on the server, so make sure we lazy load it
const ReactJson = dynamic(import('react-json-view'));

// Only allow these fields to be edited
const EDITABLE_CHAPTER_FIELDS = ['content', 'chapterType'];
const EDITABLE_BOOK_FIELDS = [
  'title',
  'description',
  'pageOrientation',
  'publishingStatus'
];

const publishingStatus = ['PUBLISHED', 'FLAGGED', 'UNLISTED'];

type State = {
  isSaving: boolean,
  book: BookDetails,
  didSave: boolean,
  chapter: ?Chapter,
  selectedPublishingStatus: PublishingStatus,
  publishingStatus: Array<PublishingStatus>
};

export default class Editor extends React.Component<
  {
    book: BookDetails,
    chapter?: Chapter
  },
  State
> {
  state = {
    isSaving: false,
    didSave: false,
    book: this.props.book,
    chapter: this.props.chapter,
    selectedPublishingStatus: this.props.book.publishingStatus,
    publishingStatus: publishingStatus
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

  handlePublishingStatusChange = (event: SyntheticInputEvent<EventTarget>) => {
    this.setState({ selectedPublishingStatus: event.target.value });
  };

  handleChangePublishingStatusButtonClick = async () => {
    this.setState(state => ({
      book: {
        ...state.book,
        publishingStatus: this.state.selectedPublishingStatus
      }
    }));
  };

  render() {
    const { book, chapter } = this.props;
    return (
      <Container>
        <h1>
          Editing book:{' '}
          <Link href={`/${book.language.code}/books/details/${book.id}`}>
            <a>{book.title}</a>
          </Link>
        </h1>
        {this.props.chapter && (
          <h2>
            Editing chapter:{' '}
            <Link
              href={`/${book.language.code}/books/read/${book.id}/${
                chapter ? chapter.id : ''
              }`}
            >
              <a>{this.props.chapter.seqNo}</a>
            </Link>
          </h2>
        )}

        <div style={{ textAlign: 'right' }}>
          {this.state.didSave && <span>Saved changes!</span>}
          <Link href={`/${book.language.code}/books/details/${book.id}`}>
            <button disabled={this.state.isSaving} style={{ margin: '0 1rem' }}>
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

        <h2>Edit Publishing Status</h2>
        <form>
          <FormControl>
            <InputLabel>Select publishing status</InputLabel>
            <Select
              native
              value={this.state.selectedPublishingStatus}
              onChange={this.handlePublishingStatusChange}
            >
              {this.state.publishingStatus.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </FormControl>
          <Button
            color="primary"
            onClick={this.handleChangePublishingStatusButtonClick}
          >
            Change status
          </Button>
        </form>
      </Container>
    );
  }
}
