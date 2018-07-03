// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React, { type Node } from 'react';
import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper
} from '@material-ui/core';

export default class Layout extends React.Component<{ children: Node }> {
  render() {
    return (
      <div css={{ display: 'flex', flexFlow: 'row wrap' }}>
        <AppBar color="primary" position="static">
          <Toolbar>
            <Typography variant="title" color="inherit" noWrap>
              Welcome to <strong>GDL Admin</strong>.
            </Typography>
          </Toolbar>
        </AppBar>

        <Paper square={true} css={{ width: '240px' }}>
          <List component="nav" css={{ width: '240px', height: '100%' }}>
            <Link prefetch href="/admin/crop">
              <ListItem button component="a">
                <ListItemText primary="Crop images" />
              </ListItem>
            </Link>
            <Link href="/admin/export">
              <ListItem button component="a">
                <ListItemText primary="Export books" />
              </ListItem>
            </Link>
            <Link prefetch href="/admin/edit">
              <ListItem button component="a">
                <ListItemText primary="Edit book" />
              </ListItem>
            </Link>
            <Link prefetch href="/admin/featured">
              <ListItem button component="a">
                <ListItemText primary="Edit featured content" />
              </ListItem>
            </Link>
            <Link href="/admin/flagged">
              <ListItem button component="a">
                <ListItemText primary="Flagged books" />
              </ListItem>
            </Link>
          </List>
        </Paper>

        <main
          css={{
            padding: 16,
            flexGrow: 1
          }}
        >
          {this.props.children}
        </main>
      </div>
    );
  }
}
