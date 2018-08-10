// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { Drawer } from '@material-ui/core';
import SearchInput from './SearchInput';

export default class SearchDrawer extends React.Component<
  {},
  { showDrawer: boolean }
> {
  state = {
    showDrawer: false
  };

  handleOpen = () => this.setState({ showDrawer: true });
  handleClose = () => this.setState({ showDrawer: false });

  render() {
    const { showDrawer } = this.state;

    return (
      <>
        <Drawer anchor="top" open={showDrawer} onClose={this.handleClose}>
          {showDrawer && <SearchInput autoFocus onSubmit={this.handleClose} />}
        </Drawer>
        {this.props.children({ onShowClick: this.handleOpen })}
      </>
    );
  }
}
