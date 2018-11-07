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

type State = {
  selectedTab: 'chapter' | 'book'
};

class RouteAwareTabBar extends React.Component<Props, State> {
  state = {
    // If the chapter id is provided in the url the default tab will be the chapters tab
    selectedTab: this.props.chapterId ? 'chapter' : 'book'
  };

  handleChange = (event: Event, selectedTab: 'chapter' | 'book') =>
    this.setState({ selectedTab });

  render() {
    const {
      router: { query }
    } = this.props;

    return (
      <AppBar position="static" color="default">
        <Tabs
          value={this.state.selectedTab}
          centered={true}
          onChange={this.handleChange}
        >
          <Tab
            label="Edit Book"
            value="book"
            onClick={() => Router.push({ pathname: '/admin/edit/book', query })}
          />
          <Tab
            label="Edit Chapters"
            value="chapter"
            onClick={() =>
              Router.push({ pathname: '/admin/edit/chapter', query })
            }
          />
        </Tabs>
      </AppBar>
    );
  }
}

export default withRouter(RouteAwareTabBar);
