// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from '@lingui/react';
import { css } from 'react-emotion';
import {
  ArrowDropDown as ArrowDropDownIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@material-ui/icons';
import {
  Card,
  CardContent,
  Typography,
  Hidden,
  Grid,
  Button,
  Paper
} from '@material-ui/core';

import {
  fetchBook,
  fetchSupportedLanguages,
  sendToTranslation
} from '../../fetch';
import type {
  BookDetails,
  Language,
  Translation,
  I18n,
  Context
} from '../../types';
import { Link, Router } from '../../routes';
import { securePage, errorPage, withI18n } from '../../hocs/';
import Layout from '../../components/Layout';
import Main from '../../components/Layout/Main';
import Footer from '../../components/Layout/Footer';
import Container from '../../components/Container';
import Head from '../../components/Head';
import BookCover from '../../components/BookCover';
import LanguageMenu from '../../components/LanguageMenu';

type Props = {
  book: BookDetails,
  statusCode?: number,
  supportedLanguages: Array<Language>,
  i18n: I18n
};

type State = {
  selectedLanguage: ?Language,
  preparingTranslation: boolean,
  translation?: Translation,
  showLanguageMenu: boolean
};

class TranslatePage extends React.Component<Props, State> {
  static async getInitialProps({ query }: Context) {
    const [bookRes, supportedLanguagesRes] = await Promise.all([
      fetchBook(query.id, query.lang),
      fetchSupportedLanguages()
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
    preparingTranslation: false,
    showLanguageMenu: false
  };

  toggleLanguageMenu = () =>
    this.setState(state => ({
      showLanguageMenu: !this.state.showLanguageMenu
    }));

  handlePrepareTranslation = async () => {
    this.setState({ preparingTranslation: true });
    if (this.state.selectedLanguage) {
      const translationRes = await sendToTranslation(
        this.props.book.id,
        this.props.book.language.code,
        this.state.selectedLanguage.code
      );
      // TODO: Handle error case
      if (translationRes.isOk) {
        this.setState({ translation: translationRes.data });
      }
    }
  };

  // When Crowdin opens in a new tab, we want to redirect the user to "my translations"
  handleStartTranslation = () => Router.pushRoute('translations');

  handleChangeLanguage = (lang: Language) =>
    this.setState({ selectedLanguage: lang, showLanguageMenu: false });

  render() {
    const { book, supportedLanguages, i18n } = this.props;
    const { selectedLanguage } = this.state;

    return (
      <Layout wrapWithMain={false} category={book.category}>
        <Head
          title={i18n.t`Translate: ${book.title}`}
          description={book.description}
          image={book.coverImage && book.coverImage.url}
        />
        <Main>
          <Paper className={styles.hero} elevation={0}>
            <Container>
              <Typography
                variant="display2"
                component="h1"
                align="center"
                color="inherit"
                gutterBottom
              >
                <Trans>Translate book</Trans>
              </Typography>
              <Grid
                container
                alignItems="center"
                css={{ marginBottom: '20px' }}
              >
                <Grid item md={4} xs={12}>
                  <Typography color="inherit" variant="button">
                    {book.language.name}
                  </Typography>
                </Grid>
                <Grid item md={4} xs={12} css={{ textAlign: 'center' }}>
                  <Hidden mdUp implementation="css">
                    <ArrowDownwardIcon />
                  </Hidden>
                  <Hidden mdDown implementation="css">
                    <ArrowForwardIcon />
                  </Hidden>
                </Grid>
                <Grid item md={4} xs={12} css={{ textAlign: 'right' }}>
                  <Button
                    color="inherit"
                    variant="outlined"
                    onClick={this.toggleLanguageMenu}
                  >
                    {selectedLanguage ? (
                      selectedLanguage.name
                    ) : (
                      <Trans>Select language</Trans>
                    )}
                    <ArrowDropDownIcon />
                  </Button>
                </Grid>
              </Grid>
            </Container>
          </Paper>
          <Container size="large">
            <Card css={{ transform: 'translateY(-60px)' }}>
              <CardContent>
                <Grid container spacing={16}>
                  <Grid item>
                    <Link
                      route="book"
                      params={{ lang: book.language.code, id: book.id }}
                    >
                      <a>
                        <BookCover
                          coverImage={book.coverImage}
                          w={[75, 120]}
                          h={[100, 150]}
                        />
                      </a>
                    </Link>
                  </Grid>
                  <Grid item xs>
                    <Typography lang={book.language.code} variant="headline">
                      {book.title}
                    </Typography>

                    <Typography paragraph variant="subheading">
                      <Trans>from {book.publisher.name}</Trans>
                    </Typography>

                    <Typography lang={book.language.code} paragraph>
                      {book.description}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Typography paragraph align="center" variant="subheading">
              By translating books, you are helping us serve more content to the
              children who need it.
            </Typography>
            <Typography paragraph align="center" variant="subheading">
              To translate this book, select the language you would like to
              translate to. You also need a <a href="#">Crowdin</a> account.
            </Typography>
            <Typography paragraph align="center">
              <a href="#">Learn more</a>
            </Typography>
          </Container>
          <Container>
            {this.state.showLanguageMenu && (
              <LanguageMenu
                languages={supportedLanguages}
                selectedLanguageCode={selectedLanguage && selectedLanguage.code}
                onSelectLanguage={this.handleChangeLanguage}
                onClose={this.toggleLanguageMenu}
              />
            )}
            {this.state.translation ? (
              <React.Fragment>
                <Button
                  href={this.state.translation.crowdinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={this.handleStartTranslation}
                >
                  <Trans>Start translation</Trans>
                </Button>
                <p>
                  <small>
                    <Trans>
                      Opens 3rd party site{' '}
                      <a href="https://crowdin.com/">Crowdin</a> in a new
                      window.
                    </Trans>
                  </small>
                </p>
              </React.Fragment>
            ) : (
              <Button
                disabled={this.state.selectedLanguage == null}
                isLoading={this.state.preparingTranslation}
                onClick={this.handlePrepareTranslation}
                size="large"
                variant="outlined"
                color="secondary"
              >
                <Trans>Prepare translation</Trans>
              </Button>
            )}
          </Container>
        </Main>
        <Footer />
      </Layout>
    );
  }
}

export default securePage(errorPage(withI18n(TranslatePage)));

const styles = {
  hero: css`
    position: relative;
    padding-top: 80px;
    padding-bottom: 100px;
    background-color: #0d47a1;
    color: #fff;
  `
};
