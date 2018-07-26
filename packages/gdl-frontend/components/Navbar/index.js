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

import { Link } from '../../routes';
import SrOnly from '../../components/SrOnly';
import GlobalDigitalLibraryLogo from './beta-logo.svg';
import media from '../../style/media';
import NavbarSearch from './NavbarSearch';

type Props = {
  onMenuClick(): void
};

// The tiny bit of padding here prevents the 'A' in 'Beta' from getting smooshed
const BrandLink = styled('a')`
  svg {
    margin-top: 2px;
    padding-right: 2px;
    height: 36px;
    width: 100px;
    ${media.tablet`
      width: auto;
    `};
  }
`;

const Navbar = ({ onMenuClick }: Props) => {
  const brandLink = (
    <Link route="books" passHref>
      <BrandLink aria-label="Global Digital Library">
        <GlobalDigitalLibraryLogo aria-hidden />
      </BrandLink>
    </Link>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={onMenuClick}
          css={{ marginRight: 18 }}
        >
          <MenuIcon />
          <SrOnly>
            <Trans>Open menu</Trans>
          </SrOnly>
        </IconButton>
        {brandLink}

        <Link route="books" passHref>
          <IconButton
            color="inherit"
            component="a"
            css={{ marginLeft: 'auto' }}
          >
            <HomeIcon />
            <SrOnly>
              <Trans>Home</Trans>
            </SrOnly>
          </IconButton>
        </Link>

        <Link route="search" passHref>
          <IconButton
            color="inherit"
            component="a"
            css={media.tablet({ display: 'none' })}
          >
            <SearchIcon />
            <SrOnly>
              <Trans>Search</Trans>
            </SrOnly>
          </IconButton>
        </Link>

        <NavbarSearch />

        <SelectLanguage anchor="right">
          {({ onClick }) => (
            <Tooltip title={<Trans>Choose book language</Trans>}>
              <IconButton onClick={onClick} color="inherit">
                <LanguageIcon />
                <SrOnly>
                  <Trans>Choose book language</Trans>
                </SrOnly>
              </IconButton>
            </Tooltip>
          )}
        </SelectLanguage>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
