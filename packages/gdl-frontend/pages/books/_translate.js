// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { I18n } from '@lingui/react';
import gql from 'graphql-tag';

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
  supportedLanguages: Array<Language>
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
