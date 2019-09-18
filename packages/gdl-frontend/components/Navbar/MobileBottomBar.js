import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { LibraryBooks, SportsEsports } from '@material-ui/icons';
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

const WrappedNavButton = ({
  label,
  name,
  value,
  params,
  children,
  ...rest
}) => (
  <Link route={name} params={params} passHref>
    <BottomNavigationAction
      {...rest}
      label={label}
      value={value}
      icon={children}
    />
  </Link>
);

const MobileBottomBar = ({
  classes,
  lang
}: {
  classes: Object,
  lang: string
}) => (
  <RouteNameContext.Consumer>
    {pageRoute => (
      <BottomNavigation value={pageRoute} showLabels className={classes.root}>
        <WrappedNavButton
          name="books"
          label="Books"
          params={{ lang }}
          value="/"
        >
          <LibraryBooks />
        </WrappedNavButton>

        <WrappedNavButton
          name="games"
          label="Games"
          params={{ lang }}
          value="/games"
        >
          <LibraryBooks />
        </WrappedNavButton>
      </BottomNavigation>
    )}
  </RouteNameContext.Consumer>
);

export default withStyles(styles)(MobileBottomBar);
