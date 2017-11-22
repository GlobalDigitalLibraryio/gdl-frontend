// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'styled-components';
import { MdMenu } from 'react-icons/lib/md';
import media from '../helpers/media';
import { Link } from '../../routes';
import Container from '../Container';
import Flex from '../Flex';
import Logo from './GDL-logo.svg';
import theme from '../../style/theme';

const Nav = styled.nav`
  position: relative;
  min-height: 54px;
  ${media.tablet`
    min-height: 80px;
  `}
  background: linear-gradient(0deg, #4884be 0%, ${theme.colors.primary} 100%);
  color: ${theme.colors.white};
  
  display: flex;
  align-items: stretch;

  ${Container} {
    display: flex;
    align-items: center;
    width: 100%;
  }
`;

const HamburgerButton = styled.button.attrs({
  type: 'button',
})`
  background: transparent;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  vertical-align: top;
  border: 1px solid transparent;
  color: ${theme.colors.white};
  font-size: 18px;
  font-weight: 500;
  > span {
    margin-left: 6px;
    ${media.mobile`
      display: none;
    `};
  }
`;

const LogoA = styled.a`
  svg {
    height: 24px;
    width: 75px;
    ${media.tablet`
      height: 36px;
      width: 110px;
    `};
  }
`;

type Props = {
  lang: ?string,
  menuIsExpanded: boolean,
  onMenuClick(): void,
};

const Navbar = ({ onMenuClick, menuIsExpanded, lang }: Props) => (
  <Nav>
    <Container mw="1075px">
      <Flex justify={['flex-start', 'flex-end']} flex="1 1 0" order={[0, 2]}>
        <HamburgerButton
          aria-label="Menu"
          onClick={onMenuClick}
          aria-expanded={menuIsExpanded}
          aria-controls="sidenav"
        >
          <MdMenu />
          <span>Menu</span>
        </HamburgerButton>
      </Flex>
      <Flex justify={['center', 'flex-start']} flex="1 1 0">
        <Link route="books" passHref params={lang ? { lang } : {}}>
          <LogoA>
            <Logo style={{ height: '35px' }} />
          </LogoA>
        </Link>
      </Flex>
      <Flex flex="1 1 0" order={[0, 1]} />
    </Container>
  </Nav>
);

Navbar.defaultProps = {
  menuIsExpanded: false,
  onMenuClick() {},
};

export default Navbar;
