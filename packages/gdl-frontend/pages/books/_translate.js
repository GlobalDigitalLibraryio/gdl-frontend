// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans, I18n } from '@lingui/react';
import { css } from 'react-emotion';
import {
  ArrowForward as ArrowForwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@material-ui/icons';
import {
  Card,
  CardContent,
  Drawer,
  Typography,
  Hidden,
  Grid,
  Button
} from '@material-ui/core';
import green from '@material-ui/core/colors/green';
import gql from 'graphql-tag';

import { sendToTranslation } from '../../fetch';
import type { Language, Translation, Context } from '../../types';
import { Link, Router } from '../../routes';
import { securePage, withErrorPage } from '../../hocs/';
import Layout from '../../components/Layout';
import { A, LoadingButton, Container } from '../../elements';
import Head from '../../components/Head';
import CoverImage from '../../components/CoverImage';
import LanguageList from '../../components/LanguageList';
import { spacing } from '../../style/theme';

import type { TranslateBook_book } from '../../gqlTypes';

const translationStates = {
  SELECT: 'SELECT',
  PREPARING: 'PREPARING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR'
};

const BOOK_QUERY = gql`
  query TranslateBook($id: ID!, $languageCode: String!) {
    book(id: $id) {
      id
      bookId
      title
      description
      publisher {
        name
      }
      language {
        code
        name
      }
      coverImage {
        url
        variants {
          height
          width
          x
          y
          ratio
        }
      }
    }
    translationLanguages(languageCode: $languageCode) {
      code
      name
    }
  }
`;

type Props = {
  book: TranslateBook_book,
  statusCode?: number,
  supportedLanguages: Array<Language>
};

type State = {
  // Duplicating the values here because Flow doesn't like $Values<translationStates>
  translationState: 'SELECT' | 'PREPARING' | 'SUCCESS' | 'ERROR',
  selectedLanguage: ?Language,
  translation?: Translation,
  showLanguageMenu: boolean
};

class TranslatePage extends React.Component<Props, State> {
  static async getInitialProps({ query, apolloClient }: Context) {
    const bookRes = await apolloClient.query({
      query: BOOK_QUERY,
      variables: { id: `${query.id}-${query.lang}`, languageCode: query.lang }
    });

    if (!bookRes.data.book) {
      return {
        statusCode: 404
      };
    }

    return {
      book: bookRes.data.book,
      supportedLanguages: bookRes.data.translationLanguages
    };
  }

  state = {
    selectedLanguage: null,
    translationState: translationStates.SELECT,
    showLanguageMenu: false
  };

  toggleLanguageMenu = () =>
    this.setState(state => ({
      showLanguageMenu: !this.state.showLanguageMenu
    }));

  handlePrepareTranslation = async () => {
    // This only makes sense if we have selected a language
    if (this.state.selectedLanguage) {
      // Set the preparing phase, to show loading indicators etc.
      this.setState({ translationState: translationStates.PREPARING });

      const translationRes = await sendToTranslation(
        this.props.book.id,
        this.props.book.language.code,
        // $FlowFixMe: We are already checking for this in the enclosing if
        this.state.selectedLanguage.code
      );

      // Based on the result of the ajax call, we either go to the success or error phase
      if (translationRes.isOk) {
        this.setState({
          translation: translationRes.data,
          translationState: translationStates.SUCCESS
        });
      } else {
        this.setState({ translationState: translationStates.ERROR });
      }
    }
  };

  // When Crowdin opens in a new tab, we want to redirect the user to "my translations"
  handleStartTranslation = () => Router.pushRoute('translations');

  handleChangeLanguage = (lang: Language) =>
    this.setState({
      selectedLanguage: lang,
      showLanguageMenu: false,
      // Make sure we clear out any previous 'success' result if change the translation language
      translationState: translationStates.SELECT,
      translation: undefined
    });

  render() {
    const { book, supportedLanguages } = this.props;
    const { selectedLanguage, translationState } = this.state;

    return (
      <Layout>
        <I18n>
          {({ i18n }) => (
            <Head
              title={i18n.t`Translate: ${book.title}`}
              description={book.description}
              image={book.coverImage && book.coverImage.url}
            />
          )}
        </I18n>
        <Container
          css={{ marginTop: spacing.large, marginBottom: spacing.large }}
        >
          <Typography
            variant="h4"
            component="h1"
            align="center"
            css={{ marginBottom: spacing.large }}
          >
            <Trans>Translate book</Trans>
          </Typography>
          <Card>
            <CardContent>
              <Grid container spacing={16}>
                <Grid item>
                  <Link
                    route="book"
                    params={{ lang: book.language.code, id: book.bookId }}
                  >
                    <a>
                      <CoverImage coverImage={book.coverImage} size="small" />
                    </a>
                  </Link>
                </Grid>
                <Grid item xs>
                  <Typography
                    lang={book.language.code}
                    variant="h5"
                    component="h2"
                  >
                    {book.title}
                  </Typography>

                  <Typography paragraph variant="subtitle1">
                    <Trans>from {book.publisher.name}</Trans>
                  </Typography>

                  <Typography lang={book.language.code} paragraph>
                    {book.description}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Grid
            container
            alignItems="center"
            css={{
              textAlign: 'center',
              marginTop: spacing.xxlarge,
              marginBottom: spacing.xxlarge
            }}
          >
            <Grid item md={4} xs={12}>
              <Typography
                variant="body2"
                color="textSecondary"
                component="span"
              >
                <Trans gutterBottom>Translate from</Trans>
              </Typography>
              <Typography
                color="inherit"
                variant="button"
                css={{ paddingTop: '8px' }}
              >
                {book.language.name}
              </Typography>
            </Grid>
            <Grid item md={4} xs={12}>
              <Hidden
                mdUp
                implementation="css"
                css={{ margin: `${spacing.large} 0` }}
              >
                <ArrowDownwardIcon />
              </Hidden>
              <Hidden mdDown implementation="css">
                <ArrowForwardIcon />
              </Hidden>
            </Grid>
            <Grid item md={4} xs={12}>
              <Typography
                variant="body2"
                color="textSecondary"
                component="span"
              >
                <Trans>Translate to</Trans>
              </Typography>
              <Button color="primary" onClick={this.toggleLanguageMenu}>
                {selectedLanguage ? (
                  selectedLanguage.name
                ) : (
                  <Trans>Select language</Trans>
                )}
              </Button>
            </Grid>
          </Grid>

          <Drawer
            open={this.state.showLanguageMenu}
            onClose={this.toggleLanguageMenu}
            anchor="right"
          >
            <LanguageList
              languages={supportedLanguages}
              selectedLanguageCode={selectedLanguage && selectedLanguage.code}
              onSelectLanguage={this.handleChangeLanguage}
            />
          </Drawer>

          <div css={{ textAlign: 'center' }}>
            {translationState === translationStates.SUCCESS ? (
              <>
                <Button
                  href={
                    this.state.translation && this.state.translation.crowdinUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={this.handleStartTranslation}
                  variant="contained"
                  color="primary"
                  size="large"
                  className={styles.buttonSucccess}
                >
                  <Trans>Start translation</Trans>
                </Button>
                <Typography css={{ marginTop: spacing.medium }}>
                  <Trans>
                    Opens 3rd party site{' '}
                    <A href="https://crowdin.com/" css={{ display: 'inline' }}>
                      Crowdin
                    </A>{' '}
                    in a new window.
                  </Trans>
                </Typography>
              </>
            ) : (
              <>
                <LoadingButton
                  isLoading={translationState === translationStates.PREPARING}
                  disabled={this.state.selectedLanguage == null}
                  onClick={this.handlePrepareTranslation}
                  color="primary"
                  size="large"
                  variant="outlined"
                >
                  <Trans>Prepare translation</Trans>
                </LoadingButton>
                {translationState === translationStates.PREPARING && (
                  <Typography css={{ marginTop: spacing.medium }}>
                    <Trans>
                      Please wait while we’re preparing the book for
                      translation. This could take some time.
                    </Trans>
                  </Typography>
                )}
              </>
            )}
            {translationState === translationStates.ERROR && (
              <Typography color="error" css={{ marginTop: spacing.medium }}>
                <Trans>
                  Something went wrong while preparing the translation. Please
                  try again.
                </Trans>
              </Typography>
            )}
          </div>
        </Container>
      </Layout>
    );
  }
}

const styles = {
  buttonSucccess: css`
    background-color: ${green[800]};
    &:hover {
      background-color: ${green[900]};
    }
  `
};

export default securePage(withErrorPage(TranslatePage));
