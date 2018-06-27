// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import Select from '@material-ui/core/Select/Select';
import Button from '@material-ui/core/Button/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import FormControl from '@material-ui/core/FormControl/FormControl';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Form, Field, FormSpy } from 'react-final-form';

import {
  fetchLanguages,
  fetchFeaturedContent,
  updateFeaturedContent,
  saveFeaturedContent,
  deleteFeaturedContent
} from '../lib/fetch';
import withMuiRoot from '../withMuiRoot';
import Container from '../components/Container';
import type { FeaturedContent, Language } from '../types';

type State = {
  featuredContent: ?FeaturedContent,
  selectedLanguage: string
};

class EditFeaturedContent extends React.Component<
  { languages: Array<Language> },
  State
> {
  static async getInitialProps() {
    const languagesRes = await fetchLanguages();

    return {
      languages: languagesRes.isOk ? languagesRes.data : []
    };
  }

  state = {
    featuredContent: null,
    selectedLanguage: ''
  };

  getFeaturedContent = async (languageCode: string) => {
    const featuredContentRes = await fetchFeaturedContent(languageCode);
    const featuredContent = featuredContentRes.isOk
      ? featuredContentRes.data[0]
      : null;

    if (featuredContent) {
      if (featuredContent.language.code !== languageCode) {
        this.setState({
          featuredContent: null
        });
      } else {
        this.setState({
          featuredContent: featuredContent
        });
      }
    }
  };

  putFeaturedContent = async content => {
    await updateFeaturedContent(content);
  };

  postFeaturedContent = async content => {
    await saveFeaturedContent(content, this.state.selectedLanguage);
  };

  handleSaveButtonClick = (defaultReturned: boolean) => (
    content: FeaturedContent
  ) => {
    defaultReturned
      ? this.postFeaturedContent(content)
      : this.putFeaturedContent(content);

    this.setState({ featuredContent: content });
  };

  handleLanguageSelect = (event: SyntheticInputEvent<EventTarget>) => {
    this.setState({ selectedLanguage: event.target.value });

    this.getFeaturedContent(event.target.value);
  };

  deleteFeaturedContent = async (id: number) => {
    await deleteFeaturedContent(id);
  };

  handleDelete = () => {
    this.deleteFeaturedContent(
      this.state.featuredContent ? this.state.featuredContent.id : -1
    );

    this.setState({ featuredContent: null });
  };

  render() {
    // If the language of the featured content is different from what we expected to fetch, there is no featured content for that language. A request defaults to english if it does not exist.
    let defaultReturned = true;
    if (
      this.state.featuredContent &&
      this.state.featuredContent.language &&
      this.state.featuredContent.language.code
    ) {
      defaultReturned =
        this.state.featuredContent.language.code !==
        this.state.selectedLanguage;
    }

    return (
      <Container>
        <Typography variant="headline" component="h1" gutterBottom>
          Edit featured content
        </Typography>

        <FormControl>
          <InputLabel htmlFor="language-select">Select language</InputLabel>

          <Select
            onChange={this.handleLanguageSelect}
            value={this.state.selectedLanguage}
            native
            inputProps={{ id: 'language-select' }}
          >
            <option value="" />
            {this.props.languages.map(language => {
              return (
                <option key={language.code} value={language.code}>
                  {language.name} ({language.code})
                </option>
              );
            })};
          </Select>
        </FormControl>

        <Form
          initialValues={
            this.state.featuredContent !== null
              ? this.state.featuredContent
              : {}
          }
          onSubmit={this.handleSaveButtonClick(defaultReturned)}
          validate={handleValidate}
          render={({ handleSubmit, pristine, invalid }) => (
            <form>
              <Grid container spacing={24} direction="column">
                <Grid item xs>
                  <Field
                    name="title"
                    render={({ input, meta }) => (
                      <>
                        <TextField
                          fullWidth
                          error={meta.error && meta.touched}
                          required
                          disabled={this.state.selectedLanguage === ''}
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
                          error={meta.error && meta.touched}
                          disabled={this.state.selectedLanguage === ''}
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
                    name="link"
                    render={({ input, meta }) => (
                      <>
                        <TextField
                          fullWidth
                          type="url"
                          error={meta.error && meta.touched}
                          required
                          disabled={this.state.selectedLanguage === ''}
                          label="Link"
                          {...input}
                        />
                        {meta.error &&
                          meta.touched && (
                            <FormHelperText error>{meta.error}</FormHelperText>
                          )}
                      </>
                    )}
                  >
                    />
                  </Field>
                </Grid>

                <Grid item xs>
                  <Field
                    name="imageUrl"
                    render={({ input, meta }) => (
                      <>
                        <TextField
                          required
                          fullWidth
                          error={meta.error && meta.touched}
                          type="url"
                          disabled={this.state.selectedLanguage === ''}
                          label="Image Url"
                          {...input}
                        />
                        {meta.error &&
                          meta.touched && (
                            <FormHelperText error>{meta.error}</FormHelperText>
                          )}
                      </>
                    )}
                  >
                    />
                  </Field>
                </Grid>

                <FormSpy
                  render={({ values }) =>
                    //$FlowFixMe
                    values.imageUrl ? (
                      <img alt="Featured content" src={values.imageUrl} />
                    ) : null
                  }
                />

                <Grid item xs>
                  <Button
                    color="primary"
                    disabled={pristine || invalid}
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Save changes
                  </Button>

                  <Grid item xs>
                    <Button
                      color="secondary"
                      // We will disable the button if there is no selected language or if the language selection causes the default feature content to be returned
                      disabled={
                        this.state.selectedLanguage === '' ||
                        !this.state.featuredContent
                      }
                      onClick={this.handleDelete}
                    >
                      Delete featured content
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
function handleValidate(values) {
  const errors = {};

  if (values.title === undefined || values.title.trim() === '') {
    errors.title = 'You have to enter a title';
  }

  if (values.description === undefined || values.description.trim() === '') {
    errors.description = 'You have to enter a description';
  }

  const regex = /http(s)?:\/\/.*/;
  if (
    values.link === undefined ||
    values.link.trim() === '' ||
    !values.link.match(regex)
  ) {
    errors.link =
      'You have to enter a valid url e.g "https://www.digitallibrary.io"';
  }

  if (
    values.imageUrl === undefined ||
    values.imageUrl.trim() === '' ||
    !values.imageUrl.match(regex)
  ) {
    errors.imageUrl =
      'You have to enter a valid image url e.g "https://images.digitallibrary.io/imageId.png"';
  }

  return errors;
}

export default withMuiRoot(EditFeaturedContent);
