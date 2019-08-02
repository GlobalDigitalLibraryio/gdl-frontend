// @flow

import {
  InputLabel,
  FormControl,
  Button,
  TextField,
  Typography,
  Select,
  Checkbox
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

import { fetchFeaturedContent, deleteFeaturedContent } from '../../lib/fetch';
import type { FeaturedContent, Language } from '../../types';

const PUBLISHING_STATUS = ['PUBLISHED', 'FLAGGED', 'UNLISTED'];
const PAGE_ORIENTATIONS = ['PORTRAIT', 'LANDSCAPE'];

type Props = {
  book: BookDetails
};
type State = {
  featuredContentList: Array<FeaturedContent>,
  isFeaturedContent: boolean,
  featuredContent: FeaturedContent
};

export default class EditBookForm extends React.Component<Props, State> {
  state = {
    featuredContentList: [],
    isFeaturedContent: false,
    featuredContent: {
      id: this.props.book.id,
      title: this.props.book.title,
      description: this.props.book.description,
      link: `/${this.props.book.language.code}/books/details/${
        this.props.book.id
      }`,
      imageUrl: this.props.book.coverImage.url,
      language: this.props.book.language
    }
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

  async componentDidMount() {
    console.log('test');
    try {
      this.inFeaturedContent();
    } catch (error) {}
  }

  getFeaturedContent = async (languageCode: string) => {
    const featuredContentRes = await fetchFeaturedContent(languageCode);

    if (featuredContentRes.isOk && featuredContentRes.data[0]) {
      if (featuredContentRes.data[0].language.code !== languageCode) {
        this.setState({
          featuredContentList: []
        });
      } else {
        this.setState({
          featuredContentList: featuredContentRes.data
        });
      }
    }
  };

  inFeaturedContent = async () => {
    try {
      await this.getFeaturedContent(this.props.book.language.code);
    } catch (error) {
      console.log(error);
    }
    console.log(this.state.featuredContentList);
    this.state.featuredContentList.some(item => item.id === this.props.book.id)
      ? this.setState({ isFeaturedContent: true })
      : this.setState({ isFeaturedContent: false });
  };

  addRemoveFeaturedContent = async () => {
    if (this.state.isFeaturedContent) {
      this.setState({ isFeaturedContent: false });
      //  await deleteFeaturedContent(this.props.book.id);
    } else {
      this.setState({ isFeaturedContent: true });
    }

    console.log(this.state.featuredContent);
  };

  render() {
    const book = this.props.book;
    console.log(book);
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
                <Button onClick={this.addRemoveFeaturedContent}>
                  <Checkbox
                    color="primary"
                    checked={this.state.isFeaturedContent}
                  />
                </Button>
              </form>
            )}
          />
        </Row>
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
