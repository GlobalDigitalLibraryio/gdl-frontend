// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from '@lingui/react';
import styled from 'react-emotion';
import { MdArrowDownward } from 'react-icons/lib/md';
import {
  fetchBook,
  fetchSupportedLanguages,
  sendToTranslation
} from '../../fetch';
import type {
  BookDetails,
  RemoteData,
  Language,
  Translation,
  I18n
} from '../../types';
import { Link } from '../../routes';
import securePage from '../../hocs/securePage';
import Layout from '../../components/Layout';
import Box from '../../components/Box';
import Flex from '../../components/Flex';
import H1 from '../../components/H1';
import Button from '../../components/Button';
import H4 from '../../components/H4';
import P from '../../components/P';
import Card from '../../components/Card';
import Container from '../../components/Container';
import Head from '../../components/Head';
import theme from '../../style/theme';
import BookCover from '../../components/BookCover';
import TranslationLanguage from '../../components/TranslationLanguageMenu';

type Props = {
  book: RemoteData<BookDetails>,
  supportedLanguages: RemoteData<Array<Language>>,
  i18n: I18n
};

type State = {
  selectedLanguage: ?Language,
  preparingTranslation: boolean,
  translation?: Translation,
  showLanguageMenu: boolean
};

const LinkLike = styled('button')`
  background: transparent;
  color: ${theme.colors.link};
  border: none;
  font-size: inherit;
  ${p => p.isUppercased && 'text-transform: uppercase;'};
`;

class TranslatePage extends React.Component<Props, State> {
  static async getInitialProps({ query, accessToken }) {
    const [book, supportedLanguages] = await Promise.all([
      fetchBook(query.id, query.lang)(accessToken),
      fetchSupportedLanguages()(accessToken)
    ]);

    const bookLanguages = book.availableLanguages.map(lang => lang.code);

    const filteredLanguages = supportedLanguages.filter(
      lang => !bookLanguages.includes(lang.code)
    );

    return {
      book,
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
      const translation = await sendToTranslation(
        this.props.book.id,
        this.props.book.language.code,
        this.state.selectedLanguage.code
      );
      this.setState({ translation });
    }
  };

  handleChangeLanguage = (lang: Language) =>
    this.setState({ selectedLanguage: lang, showLanguageMenu: false });

  render() {
    const { book, supportedLanguages, i18n } = this.props;
    const { selectedLanguage } = this.state;

    return (
      <Layout
        crumbs={[
          <Link route="book" params={{ lang: book.language.code, id: book.id }}>
            <a>{book.title}</a>
          </Link>,
          <Trans>Translate book</Trans>
        ]}
        language={book.language}
      >
        <Head
          title={i18n.t`Translate ${book.title}`}
          description={book.description}
          image={book.coverPhoto ? book.coverPhoto.large : null}
        />
        <Container py={[15, 40]} style={{ textAlign: 'center' }}>
          <H1>
            <Trans>Translate book</Trans>
          </H1>
          <Card p={[15, 20]} my={[20, 50]} textAlign="left">
            <Flex>
              <Box mr={[10, 20]}>
                <Link
                  route="book"
                  params={{ lang: book.language.code, id: book.id }}
                >
                  <a>
                    <BookCover
                      coverPhoto={book.coverPhoto}
                      w={[75, 120]}
                      h={[100, 150]}
                    />
                  </a>
                </Link>
              </Box>
              <Box>
                <H4>{book.title}</H4>
                <P color={theme.colors.grayDark}>
                  <Trans>from {book.publisher.name}</Trans>
                </P>
              </Box>
            </Flex>
          </Card>
          <Box mb={20}>
            <P color={theme.colors.grayDark}>
              <Trans>Translate from</Trans>
            </P>
            <div>{book.language.name}</div>
            <MdArrowDownward color={theme.colors.oranges.orange} size={50} />
            <P color={theme.colors.grayDark}>
              <Trans>Translate to</Trans>
            </P>
            {this.state.showLanguageMenu && (
              <TranslationLanguage
                languages={supportedLanguages}
                selectedLanguage={selectedLanguage}
                onSelectLanguage={this.handleChangeLanguage}
                onClose={this.toggleLanguageMenu}
              />
            )}
            {selectedLanguage && <strong>{selectedLanguage.name}</strong>}
            <LinkLike
              isUppercased={Boolean(selectedLanguage)}
              onClick={this.toggleLanguageMenu}
              aria-expanded={this.state.showLanguageMenu}
            >
              {selectedLanguage ? (
                <Trans>Change</Trans>
              ) : (
                <Trans>Choose language</Trans>
              )}
            </LinkLike>
          </Box>
          {this.state.translation ? (
            <React.Fragment>
              <Button
                href={this.state.translation.crowdinUrl}
                target="_blank"
                rel="noopener noreferrer"
                color="green"
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

export default securePage(TranslatePage);
