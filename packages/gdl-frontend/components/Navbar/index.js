// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'react-emotion';
import { AppBar, Toolbar, IconButton, Tooltip } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import LanguageIcon from '@material-ui/icons/Language';
import HomeIcon from '@material-ui/icons/Home';
import { Trans } from '@lingui/react';
import SelectLanguage from '../LanguageMenu/SelectLanguage';

import { logEvent } from '../../lib/analytics';
import { Link } from '../../routes';
import SrOnly from '../../components/SrOnly';
import GlobalDigitalLibraryLogo from './beta-logo.svg';
import media from '../../style/media';
import { misc } from '../../style/theme';
import SearchInput from '../Search/components/SearchInput';
import SearchDrawer from '../Search/components/SearchDrawer';

type Props = {
  onMenuClick(): void
};

// The tiny bit of padding here prevents the 'A' in 'Beta' from getting smooshed
const BrandLink = styled('a')`
  margin-right: auto;
  svg {
    margin-top: 2px;
    padding-right: 2px;
    height: 36px;
    width: 100px;
    ${media.tablet`
      width: auto;
      margin-right: 25px;
    `};
  }
`;

const Navbar = ({ onMenuClick }: Props) => {
  const brandLink = (
    <Link route="books" passHref>
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
        <Center>
          <SearchInput />
        </Center>
        <Right>
          <SearchDrawer>
            {({ onShowClick }) => (
              <IconButton
                color="inherit"
                onClick={onShowClick}
                css={media.tablet`display: none;`}
              >
                <SearchIcon />
                <SrOnly>
                  <Trans>Search</Trans>
                </SrOnly>
              </IconButton>
            )}
          </SearchDrawer>
          <Link route="books" passHref>
            <IconButton color="inherit" component="a">
              <HomeIcon />
              <SrOnly>
                <Trans>Home</Trans>
              </SrOnly>
            </IconButton>
          </Link>
          <SelectLanguage anchor="right">
            {({ onClick }) => (
              <Tooltip title={<Trans>Choose book language</Trans>}>
                <IconButton
                  onClick={() => {
                    logEvent('Navigation', 'Language', 'Globe icon');
                    onClick();
                  }}
                  color="inherit"
                >
                  <LanguageIcon />
                  <SrOnly>
                    <Trans>Choose book language</Trans>
                  </SrOnly>
                </IconButton>
              </Tooltip>
            )}
          </SelectLanguage>
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
  max-width: ${misc.containers.large};
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

export default Navbar;
