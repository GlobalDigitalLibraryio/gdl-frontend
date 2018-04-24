// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import MdSearch from 'react-icons/lib/md/search';
import MdMenu from 'react-icons/lib/md/menu';
import { Trans } from '@lingui/react';

import { Link } from '../../routes';
import SrOnly from '../../components/SrOnly';
import GlobalDigitalLibraryLogo from './beta-logo.svg';
import {
  Bar,
  DisplayContainer,
  NavItem,
  HamburgerButton,
  BrandLink
} from './styledNavbar';

type Props = {
  menuIsExpanded: boolean,
  onMenuClick(): void
};

// We need to hide/show "different" navbars here based on viewport size. Reordering the items via flex ordering isn't enough because of accessibility/tab order
const Navbar = ({ onMenuClick, menuIsExpanded }: Props) => {
  const menuButton = (
    <HamburgerButton
      type="button"
      aria-label="Menu"
      onClick={onMenuClick}
      aria-expanded={menuIsExpanded}
    >
      <MdMenu aria-hidden />
      <span>
        <Trans>Menu</Trans>
      </span>
    </HamburgerButton>
  );

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
    <Bar>
      <DisplayContainer display={['flex', 'none']}>
        <NavItem>{menuButton}</NavItem>
        <NavItem>{brandLink}</NavItem>
        <NavItem>{searchLink}</NavItem>
      </DisplayContainer>
      <DisplayContainer display={['none', 'flex']}>
        <NavItem>{brandLink}</NavItem>
        <NavItem style={{ marginLeft: 'auto', marginRight: '1rem' }}>
          {searchLink}
        </NavItem>
        <NavItem>{menuButton}</NavItem>
      </DisplayContainer>
    </Bar>
  );
};

Navbar.defaultProps = {
  menuIsExpanded: false,
  onMenuClick() {}
};

export default Navbar;
