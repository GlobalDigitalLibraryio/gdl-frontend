// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';

import type { BookDetails, Chapter, Context } from '../types';
import { fetchBook } from '../lib/fetch';
import Editor from '../components/Editor';

type Props = {
  book: BookDetails,
  chapter?: Chapter
};

export default class EditPage extends React.Component<Props> {
  static async getInitialProps({ query }: Context) {
    const bookRes = await fetchBook(query.id, query.lang);

    if (!bookRes.isOk) {
      return {
        statusCode: bookRes.statusCode
      };
    }

    return { book: bookRes.data };
  }

  render() {
    const { book } = this.props;

    return <Editor book={book} />;
  }
}
