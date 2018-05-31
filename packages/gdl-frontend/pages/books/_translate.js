// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from '@lingui/react';
import { ArrowDownward as ArrowDownwardIcon } from '@material-ui/icons';
import { Card, CardContent, Typography, Grid, Button } from '@material-ui/core';

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
import Box from '../../components/Box';
import Container from '../../components/Container';
import Head from '../../components/Head';
import BookCover from '../../components/BookCover';
import A from '../../elements/A';
import LanguageMenu from '../../components/LanguageMenu';
import { colors } from '../../style/theme';

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
      <Layout
        category={book.category}
        crumbs={[
          <Link route="book" params={{ lang: book.language.code, id: book.id }}>
            <a>{book.title}</a>
          </Link>,
          <Trans>Translate book</Trans>
        ]}
      >
        <Head
          title={i18n.t`Translate: ${book.title}`}
          description={book.description}
          image={book.coverImage && book.coverImage.url}
        />
        <Container py={[15, 40]} style={{ textAlign: 'center' }}>
          <Typography variant="display2" component="h1">
            <Trans>Translate book</Trans>
          </Typography>
          <Card textAlign="left">
            <CardContent>
              <Grid container>
                <Box mr={[10, 20]}>
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
                </Box>
                <Box>
                  <Typography>{book.title}</Typography>
                  <Typography color={colors.text.subtle}>
                    <Trans>from {book.publisher.name}</Trans>
                  </Typography>
                </Box>
              </Grid>
            </CardContent>
          </Card>
          <Box mb={20}>
            <Typography color={colors.text.subtle}>
              <Trans>Translate from</Trans>
            </Typography>
            <div>{book.language.name}</div>
            <ArrowDownwardIcon color={colors.base.orange} size={50} />
            <Typography color={colors.text.subtle}>
              <Trans>Translate to</Trans>
            </Typography>
            {this.state.showLanguageMenu && (
              <LanguageMenu
                languages={supportedLanguages}
                selectedLanguageCode={selectedLanguage && selectedLanguage.code}
                onSelectLanguage={this.handleChangeLanguage}
                onClose={this.toggleLanguageMenu}
              />
            )}
            {selectedLanguage && <strong>{selectedLanguage.name}</strong>}
            <A
              isUppercased={Boolean(selectedLanguage)}
              onClick={this.toggleLanguageMenu}
              aria-expanded={this.state.showLanguageMenu}
            >
              {selectedLanguage ? (
                <Trans>Change</Trans>
              ) : (
                <Trans>Choose language</Trans>
              )}
            </A>
          </Box>
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
                    <a href="https://crowdin.com/">Crowdin</a> in a new window.
                  </Trans>
                </small>
              </p>
            </React.Fragment>
          ) : (
            <Button
              disabled={this.state.selectedLanguage == null}
              isLoading={this.state.preparingTranslation}
              onClick={this.handlePrepareTranslation}
            >
              <Trans>Prepare translation</Trans>
            </Button>
          )}
        </Container>
      </Layout>
    );
  }
}

export default securePage(errorPage(withI18n(TranslatePage)));
