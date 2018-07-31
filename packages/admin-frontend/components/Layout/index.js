// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import React, { type Node } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import {
  AppBar,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from '@material-ui/core';
import AccountBox from '@material-ui/icons/AccountBox';
import ExpandMore from '@material-ui/icons/ExpandMore';

import { getUserName, logout } from 'gdl-auth';
import AutoCompleteSearchField from '../Search/AutoCompleteSearchField';

const drawerWidth = '240px';

class Layout extends React.Component<
  { children: Node, shouldAddPadding?: boolean },
  { anchorEl: ?HTMLElement }
> {
  state = {
    anchorEl: null
  };

  static defaultProps = {
    shouldAddPadding: true
  };

  handleClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleLogOut = () => {
    logout();
    Router.push('/');
  };

  render() {
    const { anchorEl } = this.state;

    const baseMainCSS = {
      flexGrow: 1,
      width: `calc(100% - ${drawerWidth})`,
      marginLeft: drawerWidth
    };

    const paddedMainCSS = {
      padding: 16,
      ...baseMainCSS
    };

    const renderedMainCSS = this.props.shouldAddPadding
      ? paddedMainCSS
      : baseMainCSS;

    return (
      <div css={{ display: 'flex', flexFlow: 'row wrap' }}>
        <AppBar
          color="primary"
          position="static"
          css={{
            width: `calc(100% - ${drawerWidth})`,
            marginLeft: drawerWidth
          }}
        >
          <Toolbar>
            <Typography variant="title" color="inherit" noWrap>
              <strong>GDL Admin</strong>
            </Typography>

            <div
              css={{
                maxWidth: '960px',
                width: '100%',
                margin: 'auto',
                marginTop: '8px'
              }}
            >
              <AutoCompleteSearchField />
            </div>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          css={{ width: drawerWidth, position: 'relative' }}
        >
          <ProfileMenu
            anchorEl={anchorEl}
            handleClick={this.handleClick}
            drawerWidth={drawerWidth}
            handleClose={this.handleClose}
            handleLogOut={this.handleLogOut}
          />
          <Divider />
          <List component="nav" css={{ width: drawerWidth }}>
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
        </Drawer>

        <main css={renderedMainCSS}>{this.props.children}</main>
      </div>
    );
  }
}

const ProfileMenu = ({
  anchorEl,
  handleClick,
  drawerWidth,
  handleClose,
  handleLogOut
}) => {
  const userName = getUserName();

  return (
    <div css={{ minHeight: '64px', display: 'flex' }}>
      <Button
        aria-owns={anchorEl ? 'menu-drawer' : null}
        aria-haspopup="true"
        onClick={handleClick}
        css={{
          width: drawerWidth,
          textTransform: 'none'
        }}
      >
        <AccountBox color="secondary" css={{ margin: '4px', fontSize: 36 }} />
        <Typography variant="subheading" css={{ margin: '4px' }}>
          {userName}
        </Typography>
        <ExpandMore css={{ alignItems: 'flex-end', fontSize: 18 }} />
      </Button>
      <Menu
        id="menu-drawer"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLogOut} css={{ width: drawerWidth }} button>
          Log out
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Layout;
