// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import MdSearch from 'react-icons/lib/md/search';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import MdMenu from 'react-icons/lib/md/menu';
import { Trans } from '@lingui/react';

import { Link } from '../../routes';
import SrOnly from '../../components/SrOnly';
import GlobalDigitalLibraryLogo from './beta-logo.svg';
import { NavItem, HamburgerButton, BrandLink } from './styledNavbar';

type Props = {
  menuIsExpanded: boolean,
  onMenuClick(): void
};

const styles = {
  flex: {
    flex: 1
  }
};

// We need to hide/show "different" navbars here based on viewport size. Reordering the items via flex ordering isn't enough because of accessibility/tab order
const Navbar = ({ onMenuClick, menuIsExpanded }: Props) => {
  const searchLink = (
    <Link route="search">
      <a>
        <MdSearch aria-hidden />
        <span>
          <Trans>Search</Trans>
        </span>
      </a>
    </Link>
  );

  const brandLink = (
    <Link route="books" passHref>
      <BrandLink>
        <GlobalDigitalLibraryLogo aria-hidden />
        <SrOnly>Global Digital Library</SrOnly>
      </BrandLink>
    </Link>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={onMenuClick}
          aria-expanded={menuIsExpanded}
        >
          <MdMenu />
        </IconButton>
        <NavItem>{brandLink}</NavItem>
        <Link route="search" passHref>
          <IconButton color="inherit" component="a">
            <MdSearch aria-hidden />
          </IconButton>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

Navbar.defaultProps = {
  menuIsExpanded: false,
  onMenuClick() {}
};

export default Navbar;
