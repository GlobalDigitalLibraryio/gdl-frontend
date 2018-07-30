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
import CropImageViewer from '../components/CropImageViewer';
import {
  fetchLanguages,
  fetchFeaturedContent,
  updateFeaturedContent,
  saveFeaturedContent,
  deleteFeaturedContent
} from '../lib/fetch';
import FileDialog from '../components/FileDialog';
import Layout from '../components/Layout';
import Container from '../components/Container';
import type { FeaturedContent, ImageParameters, Language } from '../types';

type Props = {
  languages: Array<Language>
};

type State = {
  featuredContent: ?FeaturedContent,
  selectedLanguage: string,
  croppedParameters: ?ImageParameters,
  fileDialogOpen: boolean,
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
    fileDialogOpen: false,
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

  handleCroppedParametersReceived = (
    croppedParameters: ImageParameters,
    change: (name: string, value: any) => void,
    imageUrl: string
  ) => {
    const baseUrl =
      imageUrl && imageUrl.includes('?')
        ? imageUrl.substring(0, imageUrl.indexOf('?'))
        : imageUrl;

    if (croppedParameters) {
      change(
        'imageUrl',
        baseUrl +
          '?cropStartX=' +
          croppedParameters.cropStartX +
          '&cropEndX=' +
          croppedParameters.cropEndX +
          '&cropStartY=' +
          croppedParameters.cropStartY +
          '&cropEndY=' +
          croppedParameters.cropEndY
      );
    }

    this.setState({ croppedParameters: croppedParameters });
  };

  handleOnUpload = (
    imageUrl: string,
    change: (name: string, value: any) => void
  ) => {
    this.setState({ fileDialogOpen: false });
    change('imageUrl', imageUrl);
  };

  handleOnCancel = (change: (value: any) => void) => {
    this.setState({ fileDialogOpen: false });

    // Set the value of the file-input to the empty string to reset it
    change('');
  };

  handleFileChosen = (
    event: SyntheticInputEvent<EventTarget>,
    onChange: (SyntheticInputEvent<any> | any) => void
  ) => {
    // Sets the filename as the value of the input field
    onChange(event.target.value);

    const file = event.target.files[0];
    this.setState({
      fileDialogOpen: true,
      file: file
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
          <Typography variant="headline" component="h1" gutterBottom>
            Edit featured content
          </Typography>

          <FormControl>
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
                    <>
                      <TextField
                        fullWidth
                        error={meta.error && meta.touched}
                        margin="normal"
                        disabled={selectedLanguage === ''}
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
                <Field
                  name="description"
                  render={({ input, meta }) => (
                    <>
                      <TextField
                        fullWidth
                        margin="normal"
                        error={meta.error && meta.touched}
                        disabled={selectedLanguage === ''}
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

                <div
                  css={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}
                >
                  <div css={{ flex: 1 }}>
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

                  <div css={{ margin: '20px' }}>or</div>

                  <div css={{ align: 'center' }}>
                    <Field
                      name="selectedFile"
                      render={({ input }) => (
                        <>
                          <input
                            disabled={this.state.selectedLanguage === ''}
                            type="file"
                            id="fileinput"
                            value={input.value}
                            onChange={event =>
                              this.handleFileChosen(event, input.onChange)
                            }
                          />

                          {this.state.file && (
                            <FileDialog
                              fileDialogOpen={this.state.fileDialogOpen}
                              selectedFile={this.state.file}
                              onCancel={() =>
                                this.handleOnCancel(input.onChange)
                              }
                              onUpload={url =>
                                this.handleOnUpload(url, form.change)
                              }
                            />
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>

                <FormSpy
                  render={({ values }) => (
                    <div>
                      {/*$FlowFixMe*/}
                      {values.imageUrl && (
                        <CropImageViewer
                          ratio={2.63}
                          imageUrl={values.imageUrl}
                          onDialogOk={croppedParameters => {
                            this.handleCroppedParametersReceived(
                              croppedParameters,
                              form.change,
                              /*$FlowFixMe*/
                              values.imageUrl
                            );
                          }}
                        />
                      )}
                    </div>
                  )}
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
      'You have to enter a valid image url e.g "https://images.digitallibrary.io/imageId.png?cropStartX=72&cropEndX=100&cropStartY=72&cropEndY=100';
  }

  return errors;
}
