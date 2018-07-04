// @flow

import { fetchBook, fetchChapter, saveBook } from '../lib/fetch';
import type { BookDetails, Chapter, Context } from '../types';
import * as React from 'react';
import Link from 'next/link';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Form, Field } from 'react-final-form';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button/Button';

import Container from './Container';
import FormHelperText from "@material-ui/core/FormHelperText";

const PUBLISHING_STATUS = ['PUBLISHED', 'FLAGGED', 'UNLISTED'];
const PAGE_ORIENTATIONS = ['VERTICAL', 'LANDSCAPE'];

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

  handleSubmit = (content: Object) => {
    this.updateBook(content);
  };

  updateBook = async (content: Object) => {
    this.setState({ book: content });

    await saveBook(content);
  };

  render() {
    const book = this.state.book;
    console.log(book);

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
        <Form
          initialValues={book}
          onSubmit={this.handleSubmit}
          validate={handleValidate}
          render={({ handleSubmit, pristine, form, invalid }) => (
            <form>
              <Grid container spacing={24} direction="column">
                <Grid item xs>
                  <Field
                    name="title"
                    render={({ input, meta }) => (
                      <>
                        <TextField
                          fullWidth
                          required
                          label="Title"
                          {...input}
                        />
                          {meta.error &&
                          meta.touched && (
                              <FormHelperText error>{meta.error}</FormHelperText>
                          )}
                      </>
                    )}
                  />
                </Grid>

                <Grid item xs>
                  <Field
                    name="description"
                    render={({ input, meta }) => (
                      <>
                        <TextField
                          fullWidth
                          required
                          label="Description"
                          {...input}
                          multiline
                        />
                          {meta.error &&
                          meta.touched && (
                              <FormHelperText error>{meta.error}</FormHelperText>
                          )}
                      </>
                    )}
                  />
                </Grid>

                <Grid item xs>
                  <Field
                    name="pageOrientation"
                    render={({ input }) => (
                      <>
                        <Select fullWidth {...input}>
                          {PAGE_ORIENTATIONS.map(orientation => (
                            <option key={orientation} value={orientation}>
                              {orientation}
                            </option>
                          ))}
                        </Select>
                      </>
                    )}
                  />
                </Grid>

                <Grid item xs>
                  <Field
                    name="publishingStatus"
                    render={({ input }) => (
                      <>
                        <Select fullWidth {...input}>
                          {PUBLISHING_STATUS.map(status => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </Select>
                      </>
                    )}
                  />
                </Grid>

                <Grid item xs>
                  <Button
                    color="primary"
                    onClick={handleSubmit}
                    type="submit"
                    disabled={pristine || invalid}
                  >
                    Save changes
                  </Button>

                  <Grid item xs>
                    <Button
                      color="secondary"
                      disabled={pristine}
                      onClick={form.reset}
                    >
                      Discard changes
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          )}
        />
      </Container>
    );
  }
}

// todo: extract this and the other validator in featured.js ?
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
