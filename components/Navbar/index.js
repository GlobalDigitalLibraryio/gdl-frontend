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

import LanguageCategoryContext from '../LanguageCategoryContext';
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
    <LanguageCategoryContext.Consumer>
      {({ language }) => (
        <Link route="search" params={{ lang: language.code }}>
          <a>
            <MdSearch aria-hidden />
            <span>
              <Trans>Search</Trans>
            </span>
          </a>
        </Link>
      )}
    </LanguageCategoryContext.Consumer>
  );

  const brandLink = (
    <LanguageCategoryContext.Consumer>
      {({ category, language }) => {
        let route;
        if (category === 'classroom_books') {
          route = 'classroom';
        } else if (category === 'library_books') {
          route = 'library';
        } else {
          route = 'books';
        }
        return (
          <Link route={route} passHref params={{ lang: language.code }}>
            <BrandLink>
              <GlobalDigitalLibraryLogo aria-hidden />
              <SrOnly>Global Digital Library</SrOnly>
            </BrandLink>
          </Link>
        );
      }}
    </LanguageCategoryContext.Consumer>
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
