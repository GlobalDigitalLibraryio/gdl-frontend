// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import * as React from 'react';
import Router from 'next/router';
import { withRouter } from 'next/router';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Tab from '@material-ui/core/Tab/Tab';
import Tabs from '@material-ui/core/Tabs/Tabs';

type Props = {
  chapterId: string,
  router: {
    pathname: string,
    query: {
      id: string,
      lang: string
    }
  }
};

class RouteAwareTabBar extends React.PureComponent<Props> {
  handleChange = (
    event: SyntheticEvent<HTMLButtonElement>,
    selectedTab: 'chapter' | 'book'
  ) => {
    const {
      router: { query }
    } = this.props;
    Router.push({ pathname: `/admin/edit/${selectedTab}`, query });
  };

  render() {
    const {
      router: { pathname }
    } = this.props;
    const value = pathname === '/admin/edit/book' ? 'book' : 'chapter';

    return (
      <AppBar position="static" color="default">
        <Tabs value={value} centered={true} onChange={this.handleChange}>
          <Tab label="Edit Book" value="book" />
          <Tab label="Edit Chapters" value="chapter" />
        </Tabs>
      </AppBar>
    );
  }
}

export default withRouter(RouteAwareTabBar);
