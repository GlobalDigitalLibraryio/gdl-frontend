// @flow

import {
  InputLabel,
  FormControl,
  Button,
  TextField,
  Typography,
  Select,
  FormHelperText
} from '@material-ui/core';
import * as React from 'react';
import Link from 'next/link';
import { Form, Field } from 'react-final-form';

import { saveBook } from '../../lib/fetch';
import type { BookDetails } from '../../types';
import Container from '../Container';
import EditBookImage from './EditBookImage';

const PUBLISHING_STATUS = ['PUBLISHED', 'FLAGGED', 'UNLISTED'];
const PAGE_ORIENTATIONS = ['PORTRAIT', 'LANDSCAPE'];

type Props = {
  book: BookDetails
};

type State = {
  book: BookDetails
};

export default class EditBookForm extends React.Component<Props, State> {
  state = {
    book: this.props.book
  };

  handleSubmit = (content: BookDetails) => {
    this.updateBook(content);
  };

  updateBook = async (content: BookDetails) => {
    const result = await saveBook(content);
    if (result.isOk) {
      this.setState({ book: content });
    }
  };

  render() {
    const book = this.state.book;

    return (
      <Container>
        {' '}
        {book && (
          <Typography variant="headline" component="h1" gutterBottom>
            Editing book:{' '}
            <Link href={`/${book.language.code}/books/details/${book.id}`}>
              <a>{book.title}</a>
            </Link>
          </Typography>
        )}
        <div css={{ display: 'flex', flexWrap: 'wrap' }}>
          <EditBookImage book={book} />
          <Form
            initialValues={book}
            onSubmit={this.handleSubmit}
            validate={handleValidate}
            render={({ handleSubmit, pristine, form, invalid }) => (
              <form>
                <Field
                  name="title"
                  render={({ input, meta }) => (
                    <>
                      <TextField
                        fullWidth
                        label="Title"
                        {...input}
                        margin="normal"
                      />
                      {meta.error &&
                        meta.touched && (
                          <FormHelperText error>{meta.error}</FormHelperText>
                        )}
                    </>
                  )}
                />

                <Field
                  name="description"
                  render={({ input, meta }) => (
                    <>
                      <TextField
                        fullWidth
                        label="Description"
                        {...input}
                        multiline
                        margin="normal"
                      />
                      {meta.error &&
                        meta.touched && (
                          <FormHelperText error>{meta.error}</FormHelperText>
                        )}
                    </>
                  )}
                />
                <div>
                  <Field
                    label="Page orientation"
                    name="pageOrientation"
                    render={({ input }) => (
                      <FormControl margin="normal">
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
                </div>
                <div>
                  <Field
                    name="publishingStatus"
                    label="Publishing status"
                    render={({ input }) => (
                      <FormControl margin="normal">
                        <InputLabel>Publishing status</InputLabel>
                        <Select {...input} native>
                          {PUBLISHING_STATUS.map(status => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </div>

                <Button
                  color="primary"
                  onClick={handleSubmit}
                  type="submit"
                  disabled={pristine || invalid}
                >
                  Save book
                </Button>

                <Button
                  color="secondary"
                  disabled={pristine}
                  onClick={form.reset}
                >
                  Discard changes
                </Button>
              </form>
            )}
          />
        </div>
      </Container>
    );
  }
}

function handleValidate(values) {
  const errors = {};

  if (values.title === undefined || values.title.trim() === '') {
    errors.title = 'You have to enter a title';
  }

  if (values.description === undefined || values.description.trim() === '') {
    errors.description = 'You have to enter a description';
  }

  return errors;
}
