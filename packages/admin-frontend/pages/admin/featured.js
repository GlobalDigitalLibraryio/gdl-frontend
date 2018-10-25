// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import {
  Select,
  Button,
  FormHelperText,
  InputLabel,
  FormControl,
  TextField,
  Typography
} from '@material-ui/core';
import { Form, Field, FormSpy } from 'react-final-form';
import {
  fetchLanguages,
  fetchFeaturedContent,
  updateFeaturedContent,
  saveFeaturedContent,
  deleteFeaturedContent
} from '../../lib/fetch';
import UploadFileDialog from '../../components/UploadFileDialog';
import FeaturedImage from '../../components/FeaturedImage';
import Layout from '../../components/Layout';
import Row from '../../components/Row';
import Container from '../../components/Container';
import isEmptyString from '../../lib/isEmptyString';
import type { FeaturedContent, Language } from '../../types';

type Props = {
  languages: Array<Language>
};

type State = {
  featuredContent: ?FeaturedContent,
  selectedLanguage: string,
  file: ?File
};

export default class EditFeaturedContent extends React.Component<Props, State> {
  static async getInitialProps() {
    const languagesRes = await fetchLanguages();

    return {
      languages: languagesRes.isOk ? languagesRes.data : []
    };
  }

  state = {
    featuredContent: null,
    selectedLanguage: '',
    croppedParameters: null,
    file: null
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

  putFeaturedContent = async (content: FeaturedContent) => {
    await updateFeaturedContent(content);
  };

  postFeaturedContent = async (content: FeaturedContent) => {
    const result = await saveFeaturedContent(
      content,
      this.state.selectedLanguage
    );
    if (result.isOk) {
      this.setState(prevState => ({
        featuredContent: { ...prevState.featuredContent, id: result.data.id }
      }));
    }
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
    this.setState({
      selectedLanguage: event.target.value
    });

    this.getFeaturedContent(event.target.value);
  };

  deleteFeaturedContent = async (id: number) => {
    await deleteFeaturedContent(id);
  };

  handleDelete = () => {
    if (this.state.featuredContent) {
      this.deleteFeaturedContent(this.state.featuredContent.id);
      this.setState({ featuredContent: null });
    }
  };

  handleOnUpload = (
    imageUrl: string,
    change: (name: string, value: any) => void
  ) => {
    this.setState({ file: null });
    change('imageUrl', imageUrl);
  };

  handleOnCancel = () => {
    this.setState({ file: null });
  };

  handleFileChosen = (event: SyntheticInputEvent<EventTarget>) => {
    this.setState({
      file: event.target.files[0]
    });
  };

  render() {
    const { featuredContent, selectedLanguage } = this.state;

    // If the language of the featured content is different from what we expected to fetch, there is no featured content for that language. A request defaults to english if it does not exist.
    let defaultReturned = true;
    if (
      featuredContent &&
      featuredContent.language &&
      featuredContent.language.code
    ) {
      defaultReturned = featuredContent.language.code !== selectedLanguage;
    }

    return (
      <Layout>
        <Container>
          <Typography variant="h5" component="h1" gutterBottom>
            Edit featured content
          </Typography>

          <FormControl fullWidth>
            <InputLabel htmlFor="language-select">Select language</InputLabel>

            <Select
              onChange={this.handleLanguageSelect}
              value={selectedLanguage}
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
              })}
              ;
            </Select>
          </FormControl>
          <Form
            initialValues={featuredContent || {}}
            onSubmit={this.handleSaveButtonClick(defaultReturned)}
            validate={handleValidate}
            render={({ handleSubmit, pristine, invalid, form }) => (
              <form>
                <Field
                  name="title"
                  render={({ input, meta }) => (
                    <TextField
                      fullWidth
                      error={meta.error && meta.touched}
                      margin="normal"
                      disabled={selectedLanguage === ''}
                      label="Title"
                      {...input}
                    />
                  )}
                />
                <Field
                  name="description"
                  render={({ input, meta }) => (
                    <TextField
                      fullWidth
                      margin="normal"
                      error={meta.error && meta.touched}
                      disabled={selectedLanguage === ''}
                      label="Description"
                      {...input}
                      multiline
                    />
                  )}
                />
                <Field
                  name="link"
                  render={({ input, meta }) => (
                    <>
                      <TextField
                        fullWidth
                        type="url"
                        error={meta.error && meta.touched}
                        margin="normal"
                        disabled={selectedLanguage === ''}
                        label="Link"
                        {...input}
                      />
                      {meta.error &&
                        meta.touched && (
                          <FormHelperText error>{meta.error}</FormHelperText>
                        )}
                    </>
                  )}
                />

                <Row
                  alignItems="center"
                  gridTemplateColumns="auto min-content min-content"
                >
                  <div>
                    <Field
                      name="imageUrl"
                      render={({ input, meta }) => (
                        <>
                          <TextField
                            fullWidth
                            margin="normal"
                            error={meta.error && meta.touched}
                            type="url"
                            disabled={selectedLanguage === ''}
                            label="Image Url"
                            {...input}
                          />
                          {meta.error &&
                            meta.touched && (
                              <FormHelperText error>
                                {meta.error}
                              </FormHelperText>
                            )}
                        </>
                      )}
                    />
                  </div>

                  <span>or</span>

                  <input
                    disabled={this.state.selectedLanguage === ''}
                    type="file"
                    accept="image/*"
                    value=""
                    onChange={event => this.handleFileChosen(event)}
                  />

                  {this.state.file && (
                    <UploadFileDialog
                      language={selectedLanguage}
                      selectedFile={this.state.file}
                      objectURL={URL.createObjectURL(this.state.file)}
                      onCancel={this.handleOnCancel}
                      onUpload={url => this.handleOnUpload(url, form.change)}
                    />
                  )}
                </Row>

                <FormSpy
                  // $FlowFixMe
                  render={({ values }) =>
                    // $FlowFixMe
                    values.imageUrl ? (
                      <FeaturedImage imageUrl={values.imageUrl} />
                    ) : null
                  }
                />

                <Button
                  color="primary"
                  disabled={invalid || pristine}
                  type="submit"
                  onClick={handleSubmit}
                >
                  Save changes
                </Button>
                <Button
                  color="secondary"
                  disabled={pristine}
                  onClick={form.reset}
                >
                  Discard changes
                </Button>
                <Button
                  color="secondary"
                  disabled={
                    selectedLanguage === '' || !featuredContent // We will disable the button if there is no selected language or if the language selection causes the default feature content to be returned
                  }
                  onClick={this.handleDelete}
                >
                  Delete featured content
                </Button>
              </form>
            )}
          />
        </Container>
      </Layout>
    );
  }
}
function handleValidate(values) {
  const errors = {};

  if (isEmptyString(values.title)) {
    errors.title = 'Required';
  }

  if (isEmptyString(values.description)) {
    errors.description = 'Required';
  }

  const regex = /http(s)?:\/\/.*/;
  if (isEmptyString(values.link) || !values.link.match(regex)) {
    errors.link = 'Must be a valid URL e.g "https://digitallibrary.io"';
  }

  if (isEmptyString(values.imageUrl) || !values.imageUrl.match(regex)) {
    errors.imageUrl =
      'Must be a valid URL image url e.g "https://images.digitallibrary.io/imageId.png';
  }

  return errors;
}
