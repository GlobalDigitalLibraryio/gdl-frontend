// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from '@lingui/react';
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
  Button
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
import { securePage, errorPage, withI18n, withMuiRoot } from '../../hocs/';
import Layout from '../../components/Layout';
import Container from '../../components/Container';
import { A } from '../../elements';
import Head from '../../components/Head';
import BookCover from '../../components/BookCover';
import LanguageMenu from '../../components/LanguageMenu';
import { spacing } from '../../style/theme';

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
      <Layout category={book.category}>
        <Head
          title={i18n.t`Translate: ${book.title}`}
          description={book.description}
          image={book.coverImage && book.coverImage.url}
        />
        <Container>
          <Typography
            variant="display2"
            component="h1"
            align="center"
            css={{ marginBottom: spacing.large, marginTop: spacing.large }}
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
          <Grid
            container
            alignItems="center"
            css={{ marginTop: spacing.large, marginBottom: spacing.large }}
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
              <Button color="primary" onClick={this.toggleLanguageMenu}>
                {selectedLanguage ? (
                  selectedLanguage.name
                ) : (
                  <Trans>Select language</Trans>
                )}
                <ArrowDropDownIcon />
              </Button>
            </Grid>
          </Grid>
          {this.state.showLanguageMenu && (
            <LanguageMenu
              languages={supportedLanguages}
              selectedLanguageCode={selectedLanguage && selectedLanguage.code}
              onSelectLanguage={this.handleChangeLanguage}
              onClose={this.toggleLanguageMenu}
            />
          )}
          <div css={{ textAlign: 'center' }}>
            {this.state.translation ? (
              <React.Fragment>
                <Button
                  href={this.state.translation.crowdinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={this.handleStartTranslation}
                  variant="outlined"
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
              </React.Fragment>
            ) : (
              <Button
                disabled={this.state.selectedLanguage == null}
                isLoading={this.state.preparingTranslation}
                onClick={this.handlePrepareTranslation}
                size="large"
                variant="outlined"
              >
                <Trans>Prepare translation</Trans>
              </Button>
            )}
          </div>
        </Container>
      </Layout>
    );
  }
}

export default withMuiRoot(securePage(errorPage(withI18n(TranslatePage))));
