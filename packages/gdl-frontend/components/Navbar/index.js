// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'react-emotion';
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
import { Trans } from '@lingui/react';

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

type Props = {
  onMenuClick(): void,
  online: boolean
};

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

const Navbar = ({ onMenuClick, online }: Props) => {
  const offline = !online;

  const brandLink = (
    <Link route={offline ? 'offline' : 'books'} passHref>
      <BrandLink
        aria-label="Global Digital Library"
        onClick={() => logEvent('Navigation', 'Home', 'Brand logo')}
      >
        <GlobalDigitalLibraryLogo aria-hidden />
      </BrandLink>
    </Link>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Left>
          <IconButton
            color="inherit"
            onClick={onMenuClick}
            css={media.tablet({ marginRight: 18 })}
          >
            <MenuIcon />
            <SrOnly>
              <Trans>Open menu</Trans>
            </SrOnly>
          </IconButton>
          {brandLink}
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
                  <Trans>Offline library</Trans>
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
                      <Trans>Search</Trans>
                    </SrOnly>
                  </IconButton>
                )}
              </SearchDrawer>
              <Link route="books" passHref>
                <IconButton
                  color="inherit"
                  component="a"
                  onClick={() => logEvent('Navigation', 'Home', 'House icon')}
                >
                  <HomeIcon />
                  <SrOnly>
                    <Trans>Home</Trans>
                  </SrOnly>
                </IconButton>
              </Link>
              <SelectBookLanguage anchor="right">
                {({ onClick, loading }) => (
                  <Tooltip title={<Trans>Choose book language</Trans>}>
                    <IconButton
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
                        <Trans>Choose book language</Trans>
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
  display: flex;
  align-items: center;
  flex: 1 25%;
  ${media.mobile`display: none`};
`;

const Right = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;

export default withOnlineStatusContext(Navbar);
