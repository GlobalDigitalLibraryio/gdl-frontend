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
import { rem } from 'polished';
import Container from './Container';
import Input from './Input';
import Flex from './Flex';

// The color of the content in the navbar
const color = '#fff';

const Nav = styled.nav`
  position: relative;
  min-height: ${rem('54px')};
  background: linear-gradient(180deg, #6098ce 1.63%, #20588f 100%);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: ${color};
`;

const NavItem = styled.div`
  display: flex;

  padding: 0.5rem 0.75rem;
`;

const HamburgerButton = styled.button.attrs({
  type: 'button',
})`
  background: transparent;
  border: 1px solid transparent;
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
        <Container maxWidth={1080} is={Flex} w={1}>
          <Input placeholder="Search for title, level or subject" />
          <HamburgerButton>
            <MdSearch />
          </HamburgerButton>
          <HamburgerButton
            onClick={this.handleHamburgerClick}
            aria-expanded={this.state.isExpanded}
          >
            <MdMenu />
          </HamburgerButton>
        </Container>
      </Nav>
    );
  }
}

export { NavItem, HamburgerButton, Nav, Navbar as default };
