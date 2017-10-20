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
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: ${props => props.theme.grays.white};
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

class Navbar extends React.Component<{}, { isExpanded: boolean }> {
  state = {
    isExpanded: false,
  };

  handleHamburgerClick = () =>
    this.setState(state => ({ isExpanded: !state.isExpanded }));

  render() {
    return (
      <Nav>
        <Container mw="1075px" is={Flex} w={1} align="stretch">
          <Flex justify="flex-start">
            <Link route="books">
              <a>
                <Logo style={{ height: '35px', marginLeft: '-25px' }} />
              </a>
            </Link>
          </Flex>
          <Flex flex="0 0 auto" mx="auto" />
          <Flex justify="flex-end">
            <HamburgerButton
              aria-label="Menu"
              onClick={this.handleHamburgerClick}
              aria-expanded={this.state.isExpanded}
              hideText={[true, false]}
            >
              <MdMenu />
              <span>Menu</span>
            </HamburgerButton>
          </Flex>
        </Container>
      </Nav>
    );
  }
}

export { NavItem, HamburgerButton, Nav, Navbar as default };
