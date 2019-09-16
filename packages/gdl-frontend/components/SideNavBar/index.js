// @flow
import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';

import {
  LibraryBooks,
  MusicNote,
  OndemandVideo,
  SportsEsports
} from '@material-ui/icons';
import { SIDE_DRAWER_WIDTH } from '../../style/constants';

const styles = theme => ({
  root: {},
  menuButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 67
  },
  icon: {
    marginRight: 0
  },
  drawer: {
    width: SIDE_DRAWER_WIDTH,
    flexShrink: 0,
    whiteSpace: 'nowrap'
  },
  drawerPaper: {
    width: SIDE_DRAWER_WIDTH,

    overflowX: 'hidden'
  }
});

const SideNavBar = ({ classes }: { classes: Object }) => {
  return (
    <Drawer
      variant="permanent"
      className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
    >
      <List disablePadding>
        <ListItem key="placeholder" className={classes.menuButton}>
          <ListItemIcon className={classes.icon}>
            <MusicNote />
          </ListItemIcon>
          <ListItemText primary="no" />
        </ListItem>
        <ListItem button className={classes.menuButton}>
          <ListItemIcon className={classes.icon}>
            <LibraryBooks />
          </ListItemIcon>
          <ListItemText primary="Books" />
        </ListItem>
        <ListItem button className={classes.menuButton}>
          <ListItemIcon className={classes.icon}>
            <MusicNote />
          </ListItemIcon>
          <ListItemText primary="Audio" />
        </ListItem>
        <ListItem button className={classes.menuButton}>
          <ListItemIcon className={classes.icon}>
            <OndemandVideo />
          </ListItemIcon>
          <ListItemText primary="Video" />
        </ListItem>
        <ListItem button className={classes.menuButton}>
          <ListItemIcon className={classes.icon}>
            <SportsEsports />
          </ListItemIcon>
          <ListItemText primary="Games" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default withStyles(styles, { withTheme: true })(SideNavBar);
