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
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';

const drawerWidth = 240; // TODO: set this to be width of drawer, not elements in drawer...
const toolbarHeight = 70; // TODO: fix this

export default class Layout extends React.Component<{ children: Node }> {
  render() {
    return (
      <div>
        <AppBar color="primary" position="absolute" css={{ zIndex: 2 }}>
          <Toolbar>
            <Typography variant="title" color="inherit" noWrap>
              Welcome to <strong>GDL Admin</strong>.
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          css={{ zIndex: 1, position: 'relative', width: drawerWidth }}
        >
          <div css={{ height: toolbarHeight, width: drawerWidth }} />
          <List component="nav">
            <Link prefetch href="/admin/crop">
              <ListItem button>
                <ListItemText primary="Crop images" />
              </ListItem>
            </Link>
            <Link href="/admin/export">
              <ListItem button>
                <ListItemText primary="Export books" />
              </ListItem>
            </Link>
            <Link prefetch href="/admin/edit">
              <ListItem button>
                <ListItemText primary="Edit book" />
              </ListItem>
            </Link>
            <Link href="/admin/flagged">
              <ListItem button>
                <ListItemText primary="Flagged books" />
              </ListItem>
            </Link>
          </List>
          <Divider />
        </Drawer>

        <main
          css={{
            marginLeft: drawerWidth,
            marginTop: toolbarHeight,
            padding: 16
          }}
        >
          {this.props.children}
        </main>
      </div>
    );
  }
}
