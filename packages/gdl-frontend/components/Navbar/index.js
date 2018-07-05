// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'react-emotion';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { Trans } from '@lingui/react';

import { Link } from '../../routes';
import SrOnly from '../../components/SrOnly';
import GlobalDigitalLibraryLogo from './beta-logo.svg';
import media from '../../style/media';

type Props = {
  menuIsExpanded: boolean,
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

const Navbar = ({ onMenuClick, menuIsExpanded }: Props) => {
  const brandLink = (
    <Link route="books" passHref>
      <BrandLink aria-label="Global Digital Library" data-cy="gdl-logo">
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
          aria-expanded={menuIsExpanded}
          css={{ marginRight: 18 }}
          data-cy="menu-button"
        >
          <MenuIcon />
          <SrOnly>
            <Trans>Menu</Trans>
          </SrOnly>
        </IconButton>
        {brandLink}
        <Link route="search" passHref>
          <IconButton
            color="inherit"
            component="a"
            css={{ marginLeft: 'auto' }}
            data-cy="search-button"
          >
            <SearchIcon />
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
