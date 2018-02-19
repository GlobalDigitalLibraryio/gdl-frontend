// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import { MdMenu, MdSearch } from 'react-icons/lib/md';
import { Trans } from '@lingui/react';

import { Link } from '../../routes';
import SrOnly from '../../components/SrOnly';
import GlobalDigitalLibraryLogo from './GDL-logo.svg';
import {
  Nav,
  Container,
  NavItem,
  HamburgerButton,
  BrandLink
} from './styledNavbar';

type Props = {
  lang: string,
  menuIsExpanded: boolean,
  onMenuClick(): void
};

const Navbar = ({ onMenuClick, menuIsExpanded, lang }: Props) => (
  <Nav>
    <Container>
      <NavItem>
        <HamburgerButton
          type="button"
          aria-label="Menu"
          onClick={onMenuClick}
          aria-expanded={menuIsExpanded}
          aria-controls="sidenav"
        >
          <MdMenu aria-hidden />
          <span>
            <Trans>Menu</Trans>
          </span>
        </HamburgerButton>
      </NavItem>
      <NavItem>
        <Link route="books" passHref params={{ lang }}>
          <BrandLink>
            <GlobalDigitalLibraryLogo aria-hidden />
            <SrOnly>Global Digital Library</SrOnly>
          </BrandLink>
        </Link>
      </NavItem>
      <NavItem>
        <Link route="search" params={{ lang }}>
          <a>
            <MdSearch aria-hidden />
            <SrOnly>
              <Trans>Search</Trans>
            </SrOnly>
          </a>
        </Link>
      </NavItem>
    </Container>
  </Nav>
);

Navbar.defaultProps = {
  menuIsExpanded: false,
  onMenuClick() {}
};

export default Navbar;
