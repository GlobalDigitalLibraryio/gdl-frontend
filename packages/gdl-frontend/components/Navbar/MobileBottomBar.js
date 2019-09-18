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
import { Link } from '../../routes';

const styles = theme => ({
  root: {
    position: 'fixed',
    width: '100%',
    bottom: 0,
    zIndex: theme.zIndex.appBar
  }
});

const WrappedNavButton = ({ label, value, params, children, ...rest }) => (
  <Link route={value} params={params} passHref>
    <BottomNavigationAction
      {...rest}
      label={label}
      value={value}
      icon={children}
    />
  </Link>
);

const MobileBottomBar = ({ classes }) => (
  <RouteNameContext.Consumer>
    {routeName => (
      <BottomNavigation
        value={routeName}
        onChange={() => {}}
        showLabels
        className={classes.root}
      >
        <WrappedNavButton label="Books" value="books">
          <LibraryBooks />
        </WrappedNavButton>

        <BottomNavigationAction label="Audio" icon={<MusicNote />} />
        <BottomNavigationAction label="Video" icon={<OndemandVideo />} />
        <WrappedNavButton label="Games" params={{ lang: 'en' }} value="games">
          <LibraryBooks />
        </WrappedNavButton>
      </BottomNavigation>
    )}
  </RouteNameContext.Consumer>
);

export default withStyles(styles)(MobileBottomBar);
