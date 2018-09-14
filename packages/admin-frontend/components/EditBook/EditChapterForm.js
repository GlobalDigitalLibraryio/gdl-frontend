// @flow

import FormControl from '@material-ui/core/FormControl/FormControl';
import * as React from 'react';
import { Form, Field } from 'react-final-form';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Link from 'next/link';
import Editor from 'gdl-editor';
import Container from '../Container';

import ChapterPreview from './ChapterPreview';
import { fetchChapter, saveChapter } from '../../lib/fetch';
import type { BookDetails, Chapter } from '../../types';
import { Page } from '../../style/Page';

type Props = {
  chapterId?: string,
  book: BookDetails
};

type State = {
  currentChapter: ?Chapter,
  currentChapterId: ?string
};

export default class EditChapterForm extends React.Component<Props, State> {
  state = {
    currentChapter: null,
    currentChapterId: this.props.chapterId
  };

  componentDidMount() {
    if (this.state.currentChapterId) {
      this.fetchSelectedChapter(this.state.currentChapterId);
    }
  }

  handleSubmit = async (content: Chapter) => {
    if (this.state.currentChapter) {
      const result = await saveChapter(this.props.book, content);

      if (result.isOk) {
        this.setState({ currentChapter: content });
      }
    }
  };

  fetchSelectedChapter = async (chapterId: ?string) => {
    let result;
    if (chapterId) {
      result = await fetchChapter(
        this.props.book.id,
        chapterId,
        this.props.book.language.code
      );
      if (result.isOk) {
        this.setState({ currentChapter: result.data });
      }
    } else {
      this.setState({ currentChapter: null });
    }
  };

  handleSelectChange = (event: SyntheticInputEvent<EventTarget>) => {
    this.setState({
      currentChapterId: event.target.value,
      currentChapter: null
    });
    this.fetchSelectedChapter(event.target.value);
  };

  render() {
    const chapterList = this.props.book.chapters;
    const book = this.props.book;
    const currentChapter = this.state.currentChapter;

    chapterList.sort(function(a, b) {
      return a.seqNo - b.seqNo;
    });

    return (
      <Container>
        <div css={{ width: '100%' }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Edit chapter:{' '}
            <Link
              href={`/${book.language.code}/books/read/${book.id}/${
                this.props.chapterId ? this.props.chapterId : ''
              }`}
            >
              <a>{book.title}</a>
            </Link>
          </Typography>

          <FormControl margin="normal">
            <InputLabel>Chapter</InputLabel>
            <Select
              native
              value={this.state.currentChapterId}
              onChange={this.handleSelectChange}
              fullWidth
            >
              <option value="" />
              {chapterList.map(chapter => (
                <option key={chapter.id} value={chapter.id}>
                  Chapter {chapter.seqNo}
                </option>
              ))}
            </Select>
          </FormControl>

          <Form
            validate={handleValidate}
            onSubmit={this.handleSubmit}
            initialValues={currentChapter ? currentChapter : {}}
            render={({ pristine, invalid, handleSubmit, form, values }) => (
              <form>
                <Field
                  name="content"
                  render={({ input, meta }) => (
                    <>
                      <TextField
                        margin="normal"
                        fullWidth
                        disabled={!currentChapter}
                        multiline
                        label="Chapter content"
                        {...input}
                      />
                      {meta.error &&
                        meta.touched && (
                          <FormHelperText error>{meta.error}</FormHelperText>
                        )}
                    </>
                  )}
                />

                <Button
                  color="primary"
                  onClick={handleSubmit}
                  type="submit"
                  disabled={pristine || invalid}
                >
                  Save chapter
                </Button>

                <Button
                  color="secondary"
                  onClick={form.reset}
                  type="submit"
                  disabled={pristine}
                >
                  Discard changes
                </Button>
                <Editor html={currentChapter && currentChapter.content} />

                {currentChapter && (
                  <div css={{ paddingTop: '16px' }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      Preview
                    </Typography>

                    <Page
                      css={{
                        maxWidth: '960px',
                        width: '100%',
                        border: '1px solid black'
                      }}
                    >
                      {/* $FlowFixMe*/}
                      <ChapterPreview content={values.content} />
                    </Page>
                  </div>
                )}
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

  if (values.content === undefined || values.content.trim() === '') {
    errors.content = 'You have to enter something into content.';
  }

  return errors;
}
