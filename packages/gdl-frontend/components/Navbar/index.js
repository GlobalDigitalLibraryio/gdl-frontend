// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from '@emotion/styled';
import {
  AppBar,
  CircularProgress,
  Toolbar,
  IconButton,
  Tooltip
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Language as LanguageIcon,
  Home as HomeIcon,
  WifiOff as WifiOffIcon
} from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';

import { withOnlineStatusContext } from '../OnlineStatusContext';
import SelectBookLanguage from '../GlobalMenu/SelectBookLanguage';
import { logEvent } from '../../lib/analytics';
import { Link } from '../../routes';
import SrOnly from '../../components/SrOnly';
import GlobalDigitalLibraryLogo from './GDL-logo.svg';
import media from '../../style/media';
import { misc } from '../../style/theme';
import SearchInput from '../Search/components/SearchInput';
import SearchDrawer from '../Search/components/SearchDrawer';
import { Hidden } from '../../elements';
import { SIDE_DRAWER_WIDTH } from '../../style/constants';

type Props = {
  onMenuClick(): void,
  online: boolean,
  homeTutorialInProgress?: boolean,
  classes: Object
};

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  toolBar: {
    minHeight: 56,
    [`@media (min-width: 600px)`]: {
      minHeight: 67
    }
  }
});

const BrandLink = styled('a')`
  margin-right: auto;
  svg {
    margin-top: 2px;
    height: 36px;
    width: 100px;
    ${media.tablet`
      width: auto;
      margin-right: 25px;
    `};
  }
`;

const Navbar = ({
  onMenuClick,
  online,
  homeTutorialInProgress,
  classes
}: Props) => {
  const offline = !online;

  const brandLink = (
    <Link route={offline ? 'offline' : 'books'} passHref>
      <BrandLink
        data-cy="gdl-logo"
        aria-label="Global Digital Library"
        onClick={() => logEvent('Navigation', 'Home', 'Brand logo')}
      >
        <GlobalDigitalLibraryLogo aria-hidden />
      </BrandLink>
    </Link>
  );

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolBar}>
        <Left>
          <IconButton
            data-cy="hamburger-menu"
            color="inherit"
            onClick={onMenuClick}
            css={media.tablet({ marginRight: 18 })}
          >
            <MenuIcon />
            <SrOnly>
              <FormattedMessage id="Open menu" defaultMessage="Open menu" />
            </SrOnly>
          </IconButton>
          <Hidden only="desktop">{brandLink}</Hidden>
        </Left>

        {/* This component is not visibile on mobile */}
        {!offline && (
          <Center>
            <SearchInput />
          </Center>
        )}

        <Right>
          {offline ? (
            <Link route="offline" passHref>
              <IconButton color="inherit" component="a">
                <WifiOffIcon />
                <SrOnly>
                  <FormattedMessage
                    id="Offline library"
                    defaultMessage="Offline library"
                  />
                </SrOnly>
              </IconButton>
            </Link>
          ) : (
            <>
              <SearchDrawer>
                {({ onShowClick }) => (
                  <IconButton
                    color="inherit"
                    onClick={onShowClick}
                    css={media.tablet`display: none;`}
                    focusRipple={false}
                  >
                    <SearchIcon />
                    <SrOnly>
                      <FormattedMessage id="Search" defaultMessage="Search" />
                    </SrOnly>
                  </IconButton>
                )}
              </SearchDrawer>
              <Link route="books" passHref>
                <IconButton
                  data-cy="home-button"
                  color="inherit"
                  component="a"
                  onClick={() => logEvent('Navigation', 'Home', 'House icon')}
                >
                  <HomeIcon />
                  <SrOnly>
                    <FormattedMessage id="Home" defaultMessage="Home" />
                  </SrOnly>
                </IconButton>
              </Link>
              <SelectBookLanguage anchor="right">
                {({ onClick, loading }) => (
                  <Tooltip
                    title={
                      <FormattedMessage
                        id="Choose book language"
                        defaultMessage="Choose book language"
                      />
                    }
                  >
                    <IconButton
                      data-cy="global-language-button"
                      onClick={() => {
                        logEvent('Navigation', 'Language', 'Globe icon');
                        onClick();
                      }}
                      color="inherit"
                    >
                      {loading ? (
                        <CircularProgress color="inherit" size={24} />
                      ) : (
                        <LanguageIcon />
                      )}
                      <SrOnly>
                        <FormattedMessage
                          id="Choose book language"
                          defaultMessage="Choose book language"
                        />
                      </SrOnly>
                    </IconButton>
                  </Tooltip>
                )}
              </SelectBookLanguage>
            </>
          )}
        </Right>
      </Toolbar>
    </AppBar>
  );
};

const Left = styled('div')`
  display: flex;
  align-items: center;
  flex: 1;
`;

const Center = styled('div')`
  display: flex;
  align-items: center;
  max-width: ${misc.containers.large}px;

  flex: 1 50%;
  ${media.mobile`display: none;`};
  ${media.largerTablet`
    max-width: ${misc.containers.small}px;
    margin-left: ${SIDE_DRAWER_WIDTH}px;
  `}
`;

const Right = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;

export default withOnlineStatusContext(
  withStyles(styles, { withTheme: true })(Navbar)
);
