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
import { getAuthToken } from 'gdl-auth';
import CropImageViewer from '../CropImageViewer';

import {
  fetchLanguages,
  fetchFeaturedContent,
  updateFeaturedContent,
  saveFeaturedContent,
  deleteFeaturedContent
} from '../lib/fetch';
import Layout from '../components/Layout';
import Container from '../components/Container';
import type { FeaturedContent, Language } from '../types';
import { imageApiUrl } from '../config';

type Props = {
  languages: Array<Language>
};

type State = {
  croppedImageUrl: string,
  featuredContent: ?FeaturedContent,
  selectedLanguage: string,
  existingParameters: ?Array<{
    forRatio: number,
    imageUrl: string,
    rawImageQueryParameters: {
      cropStartY: number,
      cropEndY: number,
      cropStartX: number,
      cropEndX: number
    }
  }>
};

class EditFeaturedContent extends React.Component<Props, State> {
  static async getInitialProps() {
    const languagesRes = await fetchLanguages();

    return {
      languages: languagesRes.isOk ? languagesRes.data : []
    };
  }

  cropImageViewer: ?CropImageViewer;

  state = {
    croppedImageUrl: '',
    featuredContent: null,
    selectedLanguage: '',
    imageApiBody: null,
    existingParameters: null
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
    console.log(content);
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

  stripImageUrlParameter(content: FeaturedContent) {
    const newContent = {
      ...content,
      imageUrl: content.imageUrl.substring(0, content.imageUrl.indexOf('?'))
    };
    console.log(newContent);

    return newContent;
  }

  handleSaveButtonClick = (defaultReturned: boolean) => (
    content: FeaturedContent
  ) => {
    const newContent = this.stripImageUrlParameter(content);

    defaultReturned
      ? this.postFeaturedContent(newContent)
      : this.putFeaturedContent(newContent);

    if (this.cropImageViewer.state.imageIsCropped) {
      this.postToImageApi(this.state.imageApiBody);
    }

    this.setState({ featuredContent: content });
  };

  postToImageApi = async (imageApiBody: any) => {
    console.log('posted!');
    console.log(imageApiBody);
    if (imageApiBody !== null) {
      const authToken = getAuthToken();
      await fetch(`${imageApiUrl}/images/stored-parameters`, {
        method: 'POST',
        headers: {
          Authorization: authToken ? `Bearer ${authToken}` : null,
          Accept: 'application/json'
        },
        body: JSON.stringify(imageApiBody)
      });
    }
  };

  handleLanguageSelect = (event: SyntheticInputEvent<EventTarget>) => {
    this.setState({ selectedLanguage: event.target.value });

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

  // todo: fix any
  handleImageUrlChanged = (formstate: any) => {

    // If we are showing the cropped image and the user changes the imageUrl we dont want to show the cropped image anymore, and we want to change icon
    if (
      this.cropImageViewer &&
      this.cropImageViewer.state.imageIsCropped === true &&
      formstate.active === 'imageUrl' &&
      formstate.values.imageUrl !== this.cropImageViewer.state.croppedImageUrl
    ) {
      console.log('revertcrop');
      this.cropImageViewer.handleRevertCrop();
    }

  };

  handleImageApiBodyReceived = (imageApiBody: any) => {
    this.setState({ imageApiBody: imageApiBody });
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

    console.log(this.state);

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
              })};
            </Select>
          </FormControl>
          <Form
            mutators={{
              setNewImageUrl: (args, state, utils) => {
                utils.changeValue(state, 'imageUrl', () => args[0]);
              }
            }}
            initialValues={featuredContent !== null ? featuredContent : {}}
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
                <Field
                  name="imageUrl"
                  render={({ input, meta }) => (
                    <>
                      <TextField
                        margin="normal"
                        fullWidth
                        error={meta.error && meta.touched}
                        type="url"
                        disabled={selectedLanguage === ''}
                        label="Image Url"
                        {...input}
                      />
                      {meta.error &&
                        meta.touched && (
                          <FormHelperText error>{meta.error}</FormHelperText>
                        )}
                    </>
                  )}
                />

                {/*we need a separate formspy to listen for url changes or else the render method will not be called*/}
                <FormSpy
                  onChange={formstate => this.handleImageUrlChanged(formstate)}
                />
                <FormSpy
                  // If the url is changed when we have cropped an image - do not show the cropped image anymore
                  render={({ values }) =>
                    /*$FlowFixMe*/
                    //todo: remove ref
                    values.imageUrl ? (
                      <CropImageViewer
                        ref={instance => {
                          this.cropImageViewer = instance;
                        }}
                        values={values}
                        form={form}
                        passImageApiBody={imageApiBody => {
                          this.handleImageApiBodyReceived(imageApiBody);
                        }}
                      />
                    ) : null
                  }
                />
                <Button
                  color="primary"
                  disabled={pristine || invalid}
                  type="submit"
                  onClick={handleSubmit}
                >
                  Save changes
                </Button>
                <Button
                  color="secondary" // We will disable the button if there is no selected language or if the language selection causes the default feature content to be returned
                  disabled={selectedLanguage === '' || !featuredContent}
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
      'You have to enter a valid image url e.g "https://images.digitallibrary.io/imageId.png"';
  }

  return errors;
}

export default EditFeaturedContent;
