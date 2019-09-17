import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import {
  LibraryBooks,
  MusicNote,
  OndemandVideo,
  SportsEsports
} from '@material-ui/icons';
import { RouteNameContext } from '../../context';

const styles = theme => ({
  root: {
    position: 'fixed',
    width: '100%',
    bottom: 0
  }
});

const MobileBottomBar = ({ classes }) => {
  return (
    <RouteNameContext.Consumer>
      {routeName => (
        <BottomNavigation
          value={routeName}
          onChange={() => {}}
          showLabels
          className={classes.root}
        >
          <BottomNavigationAction
            label="Books"
            value="books"
            icon={<LibraryBooks />}
          />
          <BottomNavigationAction label="Audio" icon={<MusicNote />} />
          <BottomNavigationAction label="Video" icon={<OndemandVideo />} />
          <BottomNavigationAction label="Games" icon={<SportsEsports />} />
        </BottomNavigation>
      )}
    </RouteNameContext.Consumer>
  );
};

export default withStyles(styles, { withTheme: true })(MobileBottomBar);
