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
import { NavItem, BrandLink } from './styledNavbar';

type Props = {
  menuIsExpanded: boolean,
  onMenuClick(): void
};

const Navbar = ({ onMenuClick, menuIsExpanded }: Props) => {
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
          css={{ marginRight: 20 }}
        >
          <MdMenu />
        </IconButton>
        <NavItem>{brandLink}</NavItem>
        <Link route="search" passHref>
          <IconButton
            color="inherit"
            component="a"
            css={{ marginLeft: 'auto' }}
          >
            <MdSearch aria-hidden />
            <SrOnly>
              <Trans>Search</Trans>
            </SrOnly>
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
