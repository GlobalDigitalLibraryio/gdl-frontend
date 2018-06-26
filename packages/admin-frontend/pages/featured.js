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

type State = {
  featuredContent: {},
  selectedLanguage: string,
  defaultReturned: boolean
};

class EditFeaturedContent extends React.Component<
  { languages: Array<any> },
  State
> {
  static async getInitialProps() {
    const languagesRes = await fetchLanguages();

    return {
      languages: languagesRes.isOk ? languagesRes.data : []
    };
  }

  state = {
    featuredContent: {},
    selectedLanguage: '',
    defaultReturned: true
  };

  getFeaturedContent = async (languageCode: string) => {
    const featuredContentRes = await fetchFeaturedContent(languageCode);
    const featuredContent = featuredContentRes.isOk
      ? featuredContentRes.data[0]
      : {};

    console.log(featuredContent);

    // If the language of the featured content is different from what we expected to fetch, there is no featured content for that language. A request defaults to english if it does not exist.
    if (featuredContent.language.code !== languageCode) {
      this.setState({
        defaultReturned: true,
        featuredContent: {
          id: featuredContent.id,
          description: '',
          language: languageCode,
          link: '',
          title: '',
          imageUrl: ''
        }
      });
    } else {
      this.setState({
        featuredContent: featuredContent,
        defaultReturned: false
      });
    }
  };

  putFeaturedContent = async content => {
    await updateFeaturedContent(content);
  };

  postFeaturedContent = async content => {
    await saveFeaturedContent(content);
  };

  handleSaveButtonClick = content => {
    this.state.defaultReturned
      ? this.postFeaturedContent(content)
      : this.putFeaturedContent(content);
  };

  handleLanguageSelect = (event: SyntheticInputEvent<EventTarget>) => {
    this.setState({ selectedLanguage: event.target.value });

    this.getFeaturedContent(event.target.value);
  };

  deleteFeaturedContent = async (id: number) => {
    await deleteFeaturedContent(id);
  };

  handleDelete = () => {
    console.log(this.state.featuredContent.id);
    this.deleteFeaturedContent(this.state.featuredContent.id);
  };

  render() {
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
          initialValues={this.state.featuredContent}
          onSubmit={this.handleSaveButtonClick}
          validate={validate}
          render={({ handleSubmit, pristine, invalid }) => (
            <form>
              <Grid container spacing={24} direction="column">
                <Grid item xs>
                  <Field
                    name="title"
                    render={({ input }) => (
                      <TextField
                        fullWidth
                        required
                        disabled={this.state.selectedLanguage === ''}
                        label="Title"
                        {...input}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs>
                  <Field
                    name="description"
                    render={({ input }) => (
                      <TextField
                        fullWidth
                        required
                        disabled={this.state.selectedLanguage === ''}
                        label="Description"
                        {...input}
                        multiline
                      />
                    )}
                  />
                </Grid>

                <Grid item xs>
                  <Field
                    name="link"
                    render={({ input }) => (
                      <TextField
                        fullWidth
                        type="url"
                        required
                        disabled={this.state.selectedLanguage === ''}
                        label="Link"
                        {...input}
                      />
                    )}
                  >
                    />
                  </Field>
                </Grid>

                <Grid item xs>
                  <Field
                    name="imageUrl"
                    render={({ input }) => (
                      <TextField
                        required
                        fullWidth
                        type="url"
                        disabled={this.state.selectedLanguage === ''}
                        label="Image Url"
                        {...input}
                      />
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
                        this.state.defaultReturned
                      }
                      type="submit"
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

function validate(values) {
  const errors = {};
  if (values.title === '') {
    errors.title = 'Required';
  }

  if (values.description === '') {
    errors.description = 'Required';
  }

  if (values.link === '') {
    errors.link = 'Required';
  }

  if (values.imageUrl === '') {
    errors.imageUrl = 'Required';
  }

  return errors;
}

export default withMuiRoot(EditFeaturedContent);
