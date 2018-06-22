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
import { Form, Field } from 'react-final-form';

import {
  fetchLanguages,
  fetchFeaturedContent,
  updateFeaturedContent
} from '../lib/fetch';
import withMuiRoot from '../withMuiRoot';
import Container from '../components/Container';

type State = {
  featuredContent: any,
  selectedLanguage: string
};

class EditFeaturedContent extends React.Component<{}, State> {
  // do this in oncomponentmount?
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

  getFeaturedContent = async (language: string) => {
    const featuredContentRes = await fetchFeaturedContent(language);
    const featuredContent = featuredContentRes.isOk
      ? featuredContentRes.data[0]
      : {};

    this.setState({
      featuredContent: featuredContent
    });
  };

  putFeaturedContent = async () => {
    await updateFeaturedContent(this.state.featuredContent);
  };

  handleSaveButtonClick = () => {
    this.putFeaturedContent();
  };

  handleLanguageSelect = (event: SyntheticInputEvent<EventTarget>) => {
    this.setState({ selectedLanguage: event.target.value });

    this.getFeaturedContent(event.target.value);
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
          render={({}) => (
            <form>
              <Grid container spacing={24} alignContent="align-center">
                <Grid item>
                  <Field
                    name="title"
                    render={({ input }) => (
                      <TextField label="Title" {...input} />
                    )}
                  />
                </Grid>

                <Grid item>
                  <Field
                    name="description"
                    render={({ input }) => (
                      <TextField label="Description" {...input} multiline />
                    )}
                  />
                </Grid>

                <Grid item xs>
                  <Button
                    color="primary"
                    disabled={
                      this.state.title === '' || this.state.description === ''
                    }
                    onClick={this.handleSaveButtonClick}
                  >
                    Save changes
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        />
      </Container>
    );
  }
}

export default withMuiRoot(EditFeaturedContent);
