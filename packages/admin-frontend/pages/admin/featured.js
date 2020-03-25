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
  InputLabel,
  FormControl,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core';
import {
  fetchLanguages,
  fetchFeaturedContent,
  updateFeaturedContent,
  saveFeaturedContent,
  deleteFeaturedContent
} from '../../lib/fetch';
import Layout from '../../components/Layout';
import Container from '../../components/Container';
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
  file: ?File,
  openDeleteDialog: boolean,
  placementOfSelectedContent: number,
  selectedContent: null | FeaturedContent
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
    featuredContentList: [],
    openDeleteDialog: false,
    selectedContent: null,
    placementOfSelectedContent: 0
  };

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
    console.log(content);
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

  deleteFeaturedContent = async (id: number) => {
    await deleteFeaturedContent(id);
  };
  handleCloseDeleteDialog = () => {
    this.setState({
      openDeleteDialog: false,
      selectedContent: null
    });
  };

  handleOpenDeleteDialog = (content: FeaturedContent, i: number) => {
    this.setState({
      openDeleteDialog: true,
      selectedContent: content,
      placementOfSelectedContent: i
    });
  };
  handleDelete = (id: number, index: number) => {
    this.deleteFeaturedContent(this.state.featuredContentList[index].id);
    this.setState(state => {
      const featuredContentList = this.state.featuredContentList.filter(
        item => item.id !== id
      );
      return {
        featuredContentList,
        openDeleteDialog: false,
        selectedContent: null
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

  getDialog = () => {
    if (this.state.selectedContent) {
      const contentId = this.state.selectedContent.id;
      return (
        <Dialog
          open={this.state.openDeleteDialog}
          onClose={this.handleCloseDeleteDialog}
          style={{ backgroundColor: 'rbga(0,0,0,0)' }}
        >
          <DialogContent>
            <DialogTitle>
              Do you want to delete {this.state.selectedContent.title} from
              featured content?
            </DialogTitle>
          </DialogContent>
          <DialogActions>
            <Button
              color="secondary"
              onClick={() =>
                this.handleDelete(
                  contentId,
                  this.state.placementOfSelectedContent
                )
              }
            >
              Delete
            </Button>
            <Button color="primary" onClick={this.handleCloseDeleteDialog}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
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
                <Card
                  style={{ width: 296, height: 450, position: 'relative' }}
                  key={content.id}
                >
                  <CardMedia
                    style={{ height: 150 }}
                    image={content.imageUrl}
                    title={content.title}
                  />
                  <CardContent>
                    <h4>{content.title}</h4>
                    <p>{content.description}</p>
                  </CardContent>
                  <CardActions
                    style={{ position: 'absolute', bottom: 0, left: 0 }}
                  >
                    <FeaturedEdit
                      button={<Button color="primary">Edit</Button>}
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
                      color="primary"
                      onClick={() => this.handleOpenDeleteDialog(content, i)}
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
                  this.state.featuredContentList,
                  this.state.selectedLanguage
                )
              : null}
          </div>
          {this.getDialog()}
        </Container>
      </Layout>
    );
  }
}
