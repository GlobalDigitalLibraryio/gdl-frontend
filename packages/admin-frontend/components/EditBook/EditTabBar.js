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
  router: {
    pathname: string,
    query: {
      id: string,
      lang: string
    }
  }
};

type State = {};

class RouteAwareTabBar extends React.Component<Props, State> {
  handleChange = (event: Event, selectedTab: number) => {
    const {
      router: { query }
    } = this.props;

    const editChapterSelected = selectedTab === 1;
    const pathname = `/admin/edit/${editChapterSelected ? 'chapter' : 'book'}`;

    Router.push({ pathname, query: { id: query.id, lang: query.lang } });
  };

  selectedTab = () => {
    const {
      router: { pathname }
    } = this.props;
    if (pathname === '/admin/edit/book') return 0;
    else if (pathname === '/admin/edit/chapter') return 1;
  };

  render() {
    return (
      <AppBar position="static" color="default">
        <Tabs
          centered={true}
          value={this.selectedTab()}
          onChange={this.handleChange}
        >
          <Tab label="Edit Book" />
          <Tab label="Edit Chapters" />
        </Tabs>
      </AppBar>
    );
  }
}

export default withRouter(RouteAwareTabBar);
