// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Tab from '@material-ui/core/Tab/Tab';
import Tabs from '@material-ui/core/Tabs/Tabs';
import Typography from '@material-ui/core/Typography/Typography';
import Container from '../../components/Container';
import EditBookForm from '../../components/EditBook/EditBookForm';
import EditChapterForm from '../../components/EditBook/EditChapterForm';
import { fetchBook } from '../../lib/fetch';
import Layout from '../../components/Layout';
import type { BookDetails, Context } from '../../types';

type State = {
  selectedTab: number
};

export default class EditPage extends React.Component<
  { book: ?BookDetails, chapterId: string },
  State
> {
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

  state = {
    // If the chapter id is provided in the url the default tab will be the chapters tab
    selectedTab: this.props.chapterId ? 1 : 0
  };

  handleChange = (event: Event, selectedTab: number) => {
    this.setState({ selectedTab });
  };

  render() {
    const { book, chapterId } = this.props;
    const selectedTab = this.state.selectedTab;

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
        <Layout shouldAddPadding={false}>
          <AppBar position="static" color="default">
            <Tabs
              centered={true}
              value={selectedTab}
              onChange={this.handleChange}
            >
              <Tab label="Edit Book" />
              <Tab label="Edit Chapters" />
            </Tabs>
          </AppBar>
          {selectedTab === 0 && (
            <TabContainer>
              <EditBookForm book={book} />
            </TabContainer>
          )}
          {selectedTab === 1 && (
            <TabContainer>
              <EditChapterForm book={book} chapterId={chapterId} />
            </TabContainer>
          )}
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
