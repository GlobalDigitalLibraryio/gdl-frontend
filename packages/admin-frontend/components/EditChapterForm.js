// @flow
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

import type { BookDetails, Chapter } from '../types';
import Container from './Container';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import { Form, Field } from 'react-final-form';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button/Button';
import FormHelperText from '@material-ui/core/FormHelperText';

import TextField from '@material-ui/core/TextField';
import ChapterPreview from './ChapterPreview';
import { fetchChapter, saveChapter } from '../lib/fetch';

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

  handleSubmit = async (content: Chapter) => {
    if (this.state.currentChapter) {
      const result = await saveChapter(this.props.book, content);

      if (result.isOk) {
        this.setState({ currentChapter: content });
      }
    }
  };

  fetchSelectedChapter = async (chapterId: string) => {
    const result = await fetchChapter(
      this.props.book.id,
      chapterId,
      this.props.book.language.code
    );

    if (result.isOk) {
      this.setState({ currentChapter: result.data });
    }
  };

  handleSelectChange = (event: SyntheticInputEvent<EventTarget>) => {
    this.setState({ currentChapterId: event.target.value });
    this.fetchSelectedChapter(event.target.value);
  };

  componentDidMount() {
    if (this.state.currentChapterId) {
      this.fetchSelectedChapter(this.state.currentChapterId);
    }
  }

  render() {
    const chapterList = this.props.book.chapters;
    chapterList.sort(function(a, b) {
      return a.seqNo - b.seqNo;
    });

    return (
        <div>


        <Typography variant="headline" component="h2" gutterBottom>
          Edit chapter
        </Typography>

        <Grid container spacing={24} direction="column">
          <Grid item xs>
            {/* todo: i have no clue why this inputlabel wont animate..*/}
            <InputLabel htmlFor="chapter-select">Select chapter</InputLabel>
            <Select
              inputProps={{ id: 'chapter-select' }}
              fullWidth
              native
              value={this.state.currentChapterId}
              onChange={this.handleSelectChange}
            >
              <option value="" />
              {chapterList.map(chapter => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.seqNo}
                </option>
              ))}
            </Select>
          </Grid>

          <Grid item xs>
            <Form
              validate={handleValidate}
              onSubmit={this.handleSubmit}
              initialValues={
                this.state.currentChapter ? this.state.currentChapter : {}
              }
              render={({ pristine, invalid, handleSubmit, form }) => (
                <form>
                  <Field
                    name="content"
                    render={({ input, meta }) => (
                      <>
                        <TextField
                          fullWidth
                          required
                          disabled={!this.state.currentChapter}
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
                </form>
              )}
            />

            <ChapterPreview
              content={
                this.state.currentChapter
                  ? this.state.currentChapter.content
                  : ''
              }
            />
          </Grid>
        </Grid>
        </div>
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
