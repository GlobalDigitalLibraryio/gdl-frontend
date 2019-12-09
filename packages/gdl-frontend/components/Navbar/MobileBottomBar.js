// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { LibraryBooks, SportsEsports } from '@material-ui/icons';
import { Link } from '../../routes';
import { getTrigger } from './helpers';
import { Slide } from '@material-ui/core';
import { withRouter } from 'next/router';
import type { NextRouter } from '../../types';

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
  lang: string,
  router: NextRouter
};

class MobileBottomBar extends React.Component<Props, { trigger: ?boolean }> {
  scrollerRef = React.createRef<HTMLDivElement>();

  state = {
    trigger: null
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
    const {
      classes,
      lang,
      router: { pathname }
    } = this.props;
    const { trigger } = this.state;

    return (
      <Slide
        direction="up"
        in={!trigger}
        // check to disable slidein animation on initial render
        timeout={{ enter: trigger === null ? 0 : 225, exit: 195 }}
      >
        <BottomNavigation value={pathname} showLabels className={classes.root}>
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
    );
  }
}

export default withRouter(withStyles(styles)(MobileBottomBar));
