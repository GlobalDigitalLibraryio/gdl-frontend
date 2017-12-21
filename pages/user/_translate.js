// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { Trans } from 'lingui-react';
import type { I18n } from 'lingui-i18n';
import { MdArrowDownward } from 'react-icons/lib/md';
import { fetchBook, fetchSupportedLanguages } from '../../fetch';
import type { Book, RemoteData, Language } from '../../types';
import securePage from '../../hocs/securePage';
import Layout from '../../components/Layout';
import Box from '../../components/Box';
import H1 from '../../components/H1';
import { Button } from '../../components/Button';
import H4 from '../../components/H4';
import P from '../../components/P';
import Card from '../../components/Card';
import Container from '../../components/Container';
import Head from '../../components/Head';
import theme from '../../style/theme';

type Props = {
  book: RemoteData<Book>,
  i18n: I18n,
  supportedLanguages: RemoteData<Array<Language>>
};

type State = {
  selectedLanguage: ?Language,
  preparingTranslation: boolean
};

class TranslatePage extends React.Component<Props, State> {
  static async getInitialProps({ query, accessToken }) {
    const [book, supportedLanguages] = await Promise.all([
      fetchBook(query.id, query.lang)(accessToken),
      fetchSupportedLanguages()(accessToken)
    ]);

    return {
      book,
      supportedLanguages
    };
  }

  state = {
    selectedLanguage: null,
    preparingTranslation: false
  };

  handlePrepareTranslation = () =>
    this.setState({ preparingTranslation: true });

  render() {
    const { book, i18n } = this.props;

    return (
      <Layout currentPage={book.title} language={book.language}>
        <Head
          title={i18n`Translate ${book.title}`}
          imageUrl={book.coverPhoto ? book.coverPhoto.large : null}
        />
        <Container py={[15, 20]} style={{ textAlign: 'center' }}>
          <H1>
            <Trans>Translate book</Trans>
          </H1>
          <Card p={[15, 20]} mt={20} textAlign="left">
            <H4>{book.title}</H4>
            <P color={theme.colors.grayDark}>
              <Trans>from {book.publisher.name}</Trans>
            </P>
          </Card>
          <Box>
            <P>
              <Trans>
                <small>Translate from</small>{' '}
                <strong>{book.language.name}</strong>
              </Trans>
            </P>
            <MdArrowDownward color={theme.colors.oranges.orange} />
            <P>
              <Trans>
                <small>Translate to</small> <strong>Amharic</strong>
              </Trans>
            </P>
          </Box>
          <Button
            disabled={this.state.selectedLanguage == null}
            loading={this.state.preparingTranslation}
            onClick={this.handlePrepareTranslation}
          >
            <Trans>Prepare translation</Trans>
          </Button>
        </Container>
      </Layout>
    );
  }
}

export default securePage(TranslatePage);
