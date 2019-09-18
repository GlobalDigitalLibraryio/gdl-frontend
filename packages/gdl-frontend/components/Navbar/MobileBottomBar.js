// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { LibraryBooks, SportsEsports } from '@material-ui/icons';
import { RouteNameContext } from '../../context';
import { Link } from '../../routes';
import { getTrigger } from './helpers';
import { Slide } from '@material-ui/core';

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
  <Link route={name} params={params} passHref prefetch={true}>
    <BottomNavigationAction
      {...rest}
      label={label}
      value={value}
      icon={children}
    />
  </Link>
);

type Props = {
  classes: Object,
  lang: string
};

class MobileBottomBar extends React.Component<Props, { trigger: boolean }> {
  scrollerRef = React.createRef<HTMLDivElement>();

  state = {
    trigger: getTrigger(null, this.scrollerRef)
  };

  handleScroll = (event: SyntheticEvent<HTMLDivElement>) =>
    this.setState({ trigger: getTrigger(event, this.scrollerRef) });

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    const { classes, lang } = this.props;
    const { trigger } = this.state;

    return (
      <RouteNameContext.Consumer>
        {pageRoute => (
          <Slide direction="up" in={!trigger}>
            <BottomNavigation
              value={pageRoute}
              showLabels
              className={classes.root}
            >
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
                <SportsEsports />
              </WrappedNavButton>
            </BottomNavigation>
          </Slide>
        )}
      </RouteNameContext.Consumer>
    );
  }
}

export default withStyles(styles)(MobileBottomBar);
