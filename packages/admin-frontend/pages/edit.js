// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import AppBar from '@material-ui/core/AppBar/AppBar';
import Tab from '@material-ui/core/Tab/Tab';
import Tabs from '@material-ui/core/Tabs/Tabs';
import Typography from '@material-ui/core/Typography/Typography';
import * as React from 'react';

import EditBookForm from '../components/EditBookForm';
import EditChapterForm from '../components/EditChapterForm';
import { fetchBook } from '../lib/fetch';

import Layout from '../components/Layout';
import type { BookDetails, Context } from '../types';

type State = {
  selectedTab: number
};

export default class EditPage extends React.Component<
  { book: BookDetails, chapterId: string },
  State
> {
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

    return (
      <Layout shouldAddPadding={false}>
        <div>
          <AppBar position="static">
            <Tabs value={selectedTab} onChange={this.handleChange}>
              <Tab label="Book" />
              <Tab label="Chapters" />
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
        </div>
      </Layout>
    );
  }
}

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}
