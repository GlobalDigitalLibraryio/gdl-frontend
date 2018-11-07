// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import Typography from '@material-ui/core/Typography/Typography';
import Container from '../../../components/Container';
import EditBookForm from '../../../components/EditBook/EditBookForm';
import EditTabBar from '../../../components/EditBook/EditTabBar';
import { fetchBook } from '../../../lib/fetch';
import Layout from '../../../components/Layout';
import type { BookDetails, Context } from '../../../types';

type Props = {
  book: ?BookDetails,
  chapterId: string
};

export default class EditBookPage extends React.Component<Props> {
  static async getInitialProps({ query }: Context) {
    if (!query.id) {
      return {};
    }

    const bookRes = await fetchBook(query.id, query.lang);
    const chapterId = query.chapterId;

    let book;
    if (bookRes.isOk) {
      book = bookRes.data;
    }

    return { book, chapterId };
  }

  render() {
    const { book, chapterId } = this.props;

    if (!book) {
      return (
        <Layout>
          <Container>
            <Typography
              align="center"
              variant="subtitle1"
              css={{ marginTop: 40 }}
            >
              Search for a book to edit it.
            </Typography>
          </Container>
        </Layout>
      );
    } else {
      return (
        // blow away the components using key so we don't have to handle updating stuff
        <Layout key={book.uuid} shouldAddPadding={false}>
          <EditTabBar chapterId={chapterId} />
          <TabContainer>
            <EditBookForm book={book} />
          </TabContainer>
        </Layout>
      );
    }
  }
}

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}
