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
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions
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
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import FeaturedEdit from './featuredEdit';
import FeatureAdd from './featuredAdd';
type Props = {
  languages: Array<Language>
};

type State = {
  featuredContentList: Array<FeaturedContent>,
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
    selectedLanguage: '',
    croppedParameters: null,
    file: null,
    featuredContentList: []
  };

  getFeaturedContent = async (languageCode: string) => {
    const featuredContentRes = await fetchFeaturedContent(languageCode);
    const featContList = [];
    let i = 0;
    while (true) {
      if (featuredContentRes.data[i]) {
        featContList.push(featuredContentRes.data[i]);
      } else {
        break;
      }
      i++;
    }

    if (featuredContentRes.isOk) {
      if (featContList[0].language.code !== languageCode) {
        this.setState({
          featuredContentList: []
        });
      } else {
        this.setState({
          featuredContentList: featContList
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
      this.setState(() => {
        const featuredContentList = this.state.featuredContentList.map(item => {
          if (item.id === content.id) {
            return content;
          } else {
            return item;
          }
        });
        return {
          featuredContentList
        };
      });
    }
  };
  postNewFeaturedContent = async (content: FeaturedContent) => {
    const result = await saveFeaturedContent(
      content,
      this.state.selectedLanguage
    );
    if (result.isOk) {
      this.getFeaturedContent(this.state.selectedLanguage);
    }
  };

  handleLanguageSelect = (event: SyntheticInputEvent<EventTarget>) => {
    this.setState({
      selectedLanguage: event.target.value
    });

    this.getFeaturedContent(event.target.value);
  };

  deleteFeaturedContent = async (id: string) => {
    await deleteFeaturedContent(id);
  };

  handleDelete = (id: string, index: number) => {
    this.deleteFeaturedContent(this.state.featuredContentList[index].id);
    this.setState(state => {
      const featuredContentList = this.state.featuredContentList.filter(
        item => item.id !== id
      );
      return {
        featuredContentList
      };
    });
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
  addFeatureContent = () => {
    console.log('ADDING');
  };
  handleSaveButtonClick = (
    defaultReturned: boolean,
    content: FeaturedContent
  ) => {
    defaultReturned
      ? this.postFeaturedContent(content)
      : this.putFeaturedContent(content);

    this.setState(() => {
      const featuredContentList = this.state.featuredContentList.map(item => {
        if (item.id === content.id) {
          return content;
        } else {
          return item;
        }
      });
      return {
        featuredContentList
      };
    });
  };

  handleSaveButtonClickNew = (
    defaultReturned: boolean,
    content: FeaturedContent
  ) => {
    this.postNewFeaturedContent(content);
  };

  render() {
    const { selectedLanguage, featuredContentList } = this.state;

    // If the language of the featured content is different from what we expected to fetch, there is no featured content for that language. A request defaults to english if it does not exist.
    let defaultReturned = true;
    if (
      featuredContentList[0] &&
      featuredContentList[0].language &&
      featuredContentList[0].language.code
    ) {
      defaultReturned =
        featuredContentList[0].language.code !== selectedLanguage;
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

          {featuredContentList.length === 0 && selectedLanguage !== '' ? (
            <p>
              There is no featured content for the language{' '}
              <b>{selectedLanguage}</b>
            </p>
          ) : null}
          <div
            css={css`
              width: 100%;
              margin-top: 24px;
              margin-bottom: 24px;
              display: grid;
              grid-gap: 20px;
              grid-template-columns: auto auto auto;
              @media only screen and (max-width: 1231px) {
                grid-template-columns: auto auto;
              }
            `}
          >
            {featuredContentList.map((content, i) => {
              return (
                <Card style={{ width: 296, height: 450 }} key={content.id}>
                  <CardMedia
                    style={{ height: 150 }}
                    image={content.imageUrl}
                    title={content.title}
                  />

                  <CardContent>
                    <h4>{content.title}</h4>
                    <p>{content.description}</p>
                  </CardContent>
                  <CardActions>
                    <FeaturedEdit
                      button={
                        <Button size="small" color="primary">
                          Edit
                        </Button>
                      }
                      featuredContentList={featuredContentList}
                      selectedLanguage={selectedLanguage}
                      i={i}
                      defaultReturned={defaultReturned}
                      handleSaveButtonClick={this.handleSaveButtonClick}
                      handleFileChosen={this.handleFileChosen}
                      handleOnCancel={this.handleOnCancel}
                      file={this.state.file}
                      handleOnUpload={this.handleOnUpload}
                    />

                    <Button
                      color="secondary"
                      onClick={() => this.handleDelete(content.id, i)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              );
            })}
            {selectedLanguage !== ''
              ? FeatureAdd(
                  defaultReturned,
                  this.handleSaveButtonClickNew,
                  this.handleFileChosen,
                  this.handleOnCancel,
                  this.state.file,
                  this.handleOnUpload,
                  this.state.featuredContentList
                )
              : null}
          </div>
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
