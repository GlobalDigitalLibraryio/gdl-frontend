// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { I18n } from '@lingui/react';

import { fetchBook, fetchSupportedLanguages } from '../../fetch';
import type { BookDetails, Language, Context } from '../../types';
import { securePage, withErrorPage } from '../../hocs';
import Layout from '../../components/Layout';
import Head from '../../components/Head';
import PrepareTranslatePage from '../../components/PrepareTranslationPage';

type Props = {
  book: BookDetails,
  statusCode?: number,
  supportedLanguages: Array<Language>
};

class TranslatePage extends React.Component<Props> {
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

  render() {
    const { book, supportedLanguages } = this.props;
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
        <PrepareTranslatePage
          book={book}
          supportedLanguages={supportedLanguages}
        />
      </Layout>
    );
  }
}

export default securePage(withErrorPage(TranslatePage));
