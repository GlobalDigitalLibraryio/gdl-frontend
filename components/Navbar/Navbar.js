// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { MdMenu, MdSearch } from 'react-icons/lib/md';
import { responsiveStyle } from 'styled-system';
import Container from '../Container';
// import Input from '../Input';
import Flex from '../Flex';
import Logo from './GDL-logo.svg';

// The color of the content in the navbar
const color = '#fff';

const Nav = styled.nav`
  position: relative;
  ${responsiveStyle(
    'min-height',
    'minHeight',
  )} background: linear-gradient(0deg, #4884be 0%, #20588f 100%);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: ${color};
`;

Nav.defaultProps = {
  minHeight: ['54px', '70px'],
};

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
  color: ${color};
  font-size: 18px;
  font-weight: 600;
  > span {
    margin-left: 6px;
    ${responsiveStyle('display', 'hideText', 'none')};
  }
`;

class Navbar extends React.Component<{}, { isExpanded: boolean }> {
  static childContextTypes = {
    reactIconBase: PropTypes.object,
  };

  state = {
    isExpanded: false,
  };

  getChildContext() {
    return {
      reactIconBase: {
        color,
        size: 24,
      },
    };
  }

  handleHamburgerClick = () =>
    this.setState(state => ({ isExpanded: !state.isExpanded }));

  render() {
    return (
      <Nav>
        <Container mw="1075px" is={Flex} w={1} align="stretch">
          <Flex justify="flex-start">
            <Logo style={{ height: '35px', marginLeft: '-25px' }} />
            {/* <Input placeholder="Search for title, level or subject" /> */}
          </Flex>
          <Flex flex="0 0 auto" mx="auto" />
          <Flex justify="flex-end">
            <HamburgerButton>
              <MdSearch />
            </HamburgerButton>
            <HamburgerButton
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
