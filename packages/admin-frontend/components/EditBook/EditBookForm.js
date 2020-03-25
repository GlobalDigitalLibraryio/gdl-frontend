// @flow

import {
  InputLabel,
  FormControl,
  Button,
  TextField,
  Typography,
  Select,
  Snackbar
} from '@material-ui/core';
import * as React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { Form, Field } from 'react-final-form';

import isEmptyString from '../../lib/isEmptyString';
import { saveBook } from '../../lib/fetch';
import type { BookDetails } from '../../types';
import Container from '../Container';
import Row from '../Row';
import BookCover from './BookCover';

import { saveFeaturedContent } from '../../lib/fetch';
import type { FeaturedContent } from '../../types';
import getConfig from 'next/config';

const {
  publicRuntimeConfig: { baseUrl }
} = getConfig();

const PUBLISHING_STATUS = ['PUBLISHED', 'FLAGGED', 'UNLISTED'];
const PAGE_ORIENTATIONS = ['PORTRAIT', 'LANDSCAPE'];

type Props = {
  book: BookDetails
};
type State = {
  snackbarMessage: ?string
};

export default class EditBookForm extends React.Component<Props, State> {
  state = {
    snackbarMessage: null
  };
  handleSubmit = (content: BookDetails) => {
    this.updateBook(content);
  };

  updateBook = async (content: BookDetails) => {
    const result = await saveBook(content);
    if (result.isOk) {
      // Simplest way to update the data is to run getInitialProps again :]
      Router.push({
        pathname: '/admin/edit/book',
        query: { id: this.props.book.id, lang: this.props.book.language.code }
      });
    }
  };

  postNewFeaturedContent = async (content: FeaturedContent) => {
    const result = await saveFeaturedContent(
      content,
      this.props.book.language.code
    );
    if (result.isOk) {
      this.setState({
        snackbarMessage: `${this.props.book.title} is added to featured content`
      });
    }
  };

  render() {
    const book = this.props.book;
    const { snackbarMessage } = this.state;
    const content = {
      id: 0,
      title: book.title,
      description: book.description,
      language: book.language,
      //default image (Grace in Space) if book does not have cover image
      imageUrl:
        book.coverImage !== undefined
          ? book.coverImage.url
          : 'https://res.cloudinary.com/dwqxoowxi/f_auto,q_auto/e7ad2d851664f1485743e157c46f7142',
      link: `${baseUrl}/${book.language.code}/books/details/${book.id}`
    };
    return (
      <Container>
        {' '}
        {book && (
          <Typography variant="h5" component="h1" gutterBottom>
            Editing book:{' '}
            <Link href={`/${book.language.code}/books/details/${book.id}`}>
              <a>{book.title}</a>
            </Link>
          </Typography>
        )}
        <Row gridTemplateColumns="min-content auto">
          <BookCover book={book} />
          <Form
            initialValues={book}
            onSubmit={this.handleSubmit}
            validate={validateForm}
            render={({ handleSubmit, pristine, form, invalid }) => (
              <form>
                <Row autoFlow="row">
                  <Field
                    name="title"
                    render={({ input, meta }) => (
                      <TextField
                        fullWidth
                        label="Title"
                        {...input}
                        error={meta.error && meta.touched}
                      />
                    )}
                  />

                  <TextField
                    fullWidth
                    label="Language"
                    value={book.language.name}
                    disabled
                  />

                  <Field
                    name="description"
                    render={({ input, meta }) => (
                      <TextField
                        fullWidth
                        label="Description"
                        {...input}
                        error={meta.error && meta.touched}
                        multiline
                      />
                    )}
                  />
                  <Field
                    name="additionalInformation"
                    render={({ input, meta }) => (
                      <TextField
                        fullWidth
                        label="Additional information"
                        {...input}
                        error={meta.error && meta.touched}
                        multiline
                      />
                    )}
                  />
                  <Row>
                    <Field
                      label="Page orientation"
                      name="pageOrientation"
                      render={({ input }) => (
                        <FormControl>
                          <InputLabel>Page orientation</InputLabel>
                          <Select fullWidth {...input} native>
                            {PAGE_ORIENTATIONS.map(orientation => (
                              <option key={orientation} value={orientation}>
                                {orientation}
                              </option>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                    <Field
                      name="publishingStatus"
                      label="Publishing status"
                      render={({ input }) => (
                        <FormControl>
                          <InputLabel>Publishing status</InputLabel>
                          <Select fullWidth {...input} native>
                            {PUBLISHING_STATUS.map(status => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </Row>
                  <div>
                    <Button
                      color="secondary"
                      disabled={pristine}
                      onClick={form.reset}
                    >
                      Discard changes
                    </Button>
                    <Button
                      color="primary"
                      onClick={handleSubmit}
                      type="submit"
                      disabled={pristine || invalid}
                    >
                      Save book
                    </Button>
                  </div>
                </Row>
                <Button
                  disabled={!pristine}
                  onClick={() => this.postNewFeaturedContent(content)}
                >
                  Add to featured content
                </Button>
              </form>
            )}
          />
        </Row>
        <Snackbar
          autoHideDuration={3000}
          open={Boolean(snackbarMessage)}
          onClose={() => this.setState({ snackbarMessage: null })}
          ContentProps={{
            'aria-describedby': 'feature-content-snack-msg'
          }}
          message={
            <span
              data-cy="save-featured-content-snackbar"
              id="save-featured-content-snackbar"
            >
              {snackbarMessage}
            </span>
          }
        />
      </Container>
    );
  }
}

function validateForm(values) {
  const errors = {};

  if (isEmptyString(values.title)) {
    errors.title = 'Required';
  }

  if (isEmptyString(values.description)) {
    errors.description = 'Required';
  }

  return errors;
}
