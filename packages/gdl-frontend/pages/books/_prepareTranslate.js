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

import {
  fetchBook,
  fetchSupportedLanguages,
  sendToTranslation
} from '../../fetch';
import type { BookDetails, Language, Translation, Context } from '../../types';
import { Link } from '../../routes';
import { securePage, withErrorPage } from '../../hocs';
import Layout from '../../components/Layout';
import { LoadingButton, Container } from '../../elements';
import Head from '../../components/Head';
import CoverImage from '../../components/CoverImage';
import LanguageList from '../../components/LanguageList';
import { spacing } from '../../style/theme';

type Props = {
  book: BookDetails,
  statusCode?: number,
  supportedLanguages: Array<Language>
};

const translationStates = {
  SELECT: 'SELECT',
  PREPARING: 'PREPARING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR'
};

type State = {
  // Duplicating the values here because Flow doesn't like $Values<translationStates>
  translationState: 'SELECT' | 'PREPARING' | 'SUCCESS' | 'ERROR',
  selectedLanguage: ?Language,
  translation?: Translation,
  showLanguageMenu: boolean
};

class PrepareTranslatePage extends React.Component<Props, State> {
  static async getInitialProps({ query }: Context) {
    const [bookRes, supportedLanguagesRes] = await Promise.all([
      fetchBook(query.id, query.lang),
      fetchSupportedLanguages(query.lang)
    ]);

    if (!bookRes.isOk || !supportedLanguagesRes.isOk) {
      return {
        statusCode: bookRes.isOk
          ? bookRes.statusCode
          : supportedLanguagesRes.statusCode
      };
    }

    const bookLanguages = bookRes.data.availableLanguages.map(
      lang => lang.code
    );

    const filteredLanguages = supportedLanguagesRes.data.filter(
      lang => !bookLanguages.includes(lang.code)
    );

    return {
      book: bookRes.data,
      supportedLanguages: filteredLanguages
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
                    params={{ lang: book.language.code, id: book.id }}
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
              <Link
                passHref
                route={`/en/books/translate/${this.props.book.id}`}
                params={{
                  id: this.props.book.id,
                  lang: this.props.book.language.code
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  className={styles.buttonSucccess}
                >
                  <Trans>Start translation</Trans>
                </Button>
              </Link>
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

export default securePage(withErrorPage(PrepareTranslatePage));
