// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import { LibraryBooks, SportsEsports } from '@material-ui/icons';
import { SIDE_DRAWER_WIDTH } from '../../style/constants';
import { RouteNameContext } from '../../context';
import { Link } from '../../routes';

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

const SideMenuBar = ({ classes, lang }: { classes: Object, lang: string }) => (
  <RouteNameContext.Consumer>
    {pageRoute => (
      <Drawer
        variant="permanent"
        className={classes.drawer}
        classes={{ paper: classes.drawerPaper }}
      >
        <List disablePadding>
          <ListItem key="placeholder" className={classes.menuButton}>
            <ListItemIcon className={classes.icon}>
              <LibraryBooks />
            </ListItemIcon>
            <ListItemText primary="no" />
          </ListItem>
          <Link route="books" params={{ lang }} passHref>
            <ListItem
              button
              selected={pageRoute === '/'}
              className={classes.menuButton}
            >
              <ListItemIcon className={classes.icon}>
                <LibraryBooks />
              </ListItemIcon>
              <ListItemText primary="Books" />
            </ListItem>
          </Link>

          <Link route="games" params={{ lang }} passHref>
            <ListItem
              button
              selected={pageRoute === '/games'}
              className={classes.menuButton}
            >
              <ListItemIcon className={classes.icon}>
                <SportsEsports />
              </ListItemIcon>
              <ListItemText primary="Games" />
            </ListItem>
          </Link>
        </List>
      </Drawer>
    )}
  </RouteNameContext.Consumer>
);

export default withStyles(styles)(SideMenuBar);
