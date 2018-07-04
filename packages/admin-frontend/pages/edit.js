// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import * as React from 'react';

import EditBookForm from '../components/EditBookForm';
import EditChapterForm from '../components/EditChapterForm';
import { fetchBook} from '../lib/fetch';

import Layout from '../components/Layout';

export default class EditPage extends React.Component<> {
  static async getInitialProps({ query }: Context) {
    const bookRes = await fetchBook(query.id, query.lang);
    if (!bookRes.isOk) {
      return {
        statusCode: bookRes.statusCode
      };
    }
    const book = bookRes.data;
    const chapterId = query.chapterId;

    return { book, chapterId };
  }

  render() {
    const { book, chapterId } = this.props;

    return (
      <Layout>
        <div>
          <EditBookForm book={book} />

          <EditChapterForm book={book} chapterId={chapterId} />
        </div>
      </Layout>
    );
  }
}
