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
import { withRouter } from 'next/router';
import { SIDE_DRAWER_WIDTH } from '../../style/constants';
import { Link } from '../../routes';
import { CategoryContext } from '../../context/CategoryContext';
import type { NextRouter } from '../../types';

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

const SideMenuBar = ({
  classes,
  lang,
  router: { pathname }
}: {
  classes: Object,
  lang: string,
  router: NextRouter
}) => (
  <CategoryContext.Consumer>
    {({ setCategory }) => (
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
          <Link route="books" params={{ lang }} passHref prefetch>
            <ListItem
              button
              onClick={() => setCategory('books')}
              selected={pathname === '/'}
              className={classes.menuButton}
            >
              <ListItemIcon className={classes.icon}>
                <LibraryBooks />
              </ListItemIcon>
              <ListItemText primary="Books" />
            </ListItem>
          </Link>

          <Link route="games" params={{ lang }} passHref prefetch>
            <ListItem
              button
              onClick={() => setCategory('games')}
              selected={pathname === '/games'}
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
  </CategoryContext.Consumer>
);

export default withRouter(withStyles(styles)(SideMenuBar));
