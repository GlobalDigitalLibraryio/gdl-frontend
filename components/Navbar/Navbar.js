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

const Nav = styled.nav`
  position: relative;
  min-height: 54px;
  ${media.tablet`
    min-height: 80px;
  `}
  background: linear-gradient(0deg, #4884be 0%, ${props =>
    props.theme.primaries.primary} 100%);
  color: ${props => props.theme.grays.white};
  
  display: flex;
  align-items: stretch;

  ${Container} {
    display: flex;
    align-items: center;
    width: 100%;
  }
`;

const NavItem = styled.div`
  display: flex;
  padding: 0.5rem 0.75rem;
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
  color: ${props => props.theme.grays.white};
  font-size: 18px;
  font-weight: 600;
  > span {
    margin-left: 6px;
    display: none;
    ${media.tablet`
      display: unset;
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
};

class Navbar extends React.Component<Props, { isExpanded: boolean }> {
  state = {
    isExpanded: false,
  };

  handleHamburgerClick = () =>
    this.setState(state => ({ isExpanded: !state.isExpanded }));

  render() {
    return (
      <Nav>
        <Container mw="1075px">
          <Flex
            justify={['flex-start', 'flex-end']}
            flex="1 1 0"
            order={[0, 2]}
          >
            <HamburgerButton
              aria-label="Menu"
              onClick={this.handleHamburgerClick}
              aria-expanded={this.state.isExpanded}
            >
              <MdMenu />
              <span>Menu</span>
            </HamburgerButton>
          </Flex>
          <Flex justify={['center', 'flex-start']} flex="1 1 0">
            <Link
              route="books"
              passHref
              params={this.props.lang ? { lang: this.props.lang } : {}}
            >
              <LogoA>
                <Logo style={{ height: '35px' }} />
              </LogoA>
            </Link>
          </Flex>
          <Flex flex="1 1 0" order={[0, 1]} />
        </Container>
      </Nav>
    );
  }
}

export { NavItem, HamburgerButton, Nav, Navbar as default };
