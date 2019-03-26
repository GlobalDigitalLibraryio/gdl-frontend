// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { injectIntl } from 'react-intl';
import gql from 'graphql-tag';

import type { intlShape } from 'react-intl';
import type { Context } from '../../types';
import { securePage, withErrorPage } from '../../hocs/';
import Layout from '../../components/Layout';
import Head from '../../components/Head';
import PrepareTranslatePage from '../../components/PrepareTranslationPage';

import type {
  TranslateBook_book,
  TranslateBook_translationLanguages as Language
} from '../../gqlTypes';

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
  supportedLanguages: Array<Language>,
  intl: intlShape
};

class TranslatePage extends React.Component<Props> {
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

  render() {
    const { book, supportedLanguages, intl } = this.props;
    return (
      <Layout>
        <Head
          title={intl.formatMessage(
            { id: 'Translate', defaultMessage: 'Translate {title}' },
            { title: book.title }
          )}
          description={book.description}
          image={book.coverImage && book.coverImage.url}
        />
        <PrepareTranslatePage
          book={book}
          supportedLanguages={supportedLanguages}
        />
      </Layout>
    );
  }
}

export default securePage(withErrorPage(injectIntl(TranslatePage)));
