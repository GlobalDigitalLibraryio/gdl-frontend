// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2017 GDL
 *
 * See LICENSE
 */

import * as React from 'react';
import styled from 'react-emotion';
import {
  AppBar,
  Drawer,
  IconButton,
  Toolbar,
  Tooltip
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import LanguageIcon from '@material-ui/icons/Language';
import HomeIcon from '@material-ui/icons/Home';
import { Trans } from '@lingui/react';
import SelectLanguage from '../LanguageMenu/SelectLanguage';

import { Link } from '../../routes';
import SrOnly from '../../components/SrOnly';
import GlobalDigitalLibraryLogo from './beta-logo.svg';
import media from '../../style/media';
import NavbarSearch from './NavbarSearch';

type Props = {
  onMenuClick(): void
};

type State = {
  searchIsOpen: boolean
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

const brandLink = (
  <Link route="books" passHref>
    <BrandLink aria-label="Global Digital Library">
      <GlobalDigitalLibraryLogo aria-hidden />
    </BrandLink>
  </Link>
);

class Navbar extends React.Component<Props, State> {
  state = {
    searchIsOpen: false
  };

  handleSearchClick = () => {
    this.setState({ searchIsOpen: true });
  };

  handleSearchClose = () => {
    this.setState({ searchIsOpen: false });
  };

  render() {
    const { searchIsOpen } = this.state;

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={this.props.onMenuClick}
              css={media.tablet({ marginRight: 18 })}
            >
              <MenuIcon />
              <SrOnly>
                <Trans>Open menu</Trans>
              </SrOnly>
            </IconButton>
            {brandLink}

            <Link route="books" passHref>
              <IconButton
                color="inherit"
                component="a"
                css={{ marginLeft: 'auto' }}
              >
                <HomeIcon />
                <SrOnly>
                  <Trans>Home</Trans>
                </SrOnly>
              </IconButton>
            </Link>

            <IconButton
              color="inherit"
              onClick={this.handleSearchClick}
              css={media.tablet({ display: 'none' })}
            >
              <SearchIcon />
              <SrOnly>
                <Trans>Search</Trans>
              </SrOnly>
            </IconButton>

            <SelectLanguage anchor="right">
              {({ onClick }) => (
                <Tooltip title={<Trans>Choose book language</Trans>}>
                  <IconButton onClick={onClick} color="inherit">
                    <LanguageIcon />
                    <SrOnly>
                      <Trans>Choose book language</Trans>
                    </SrOnly>
                  </IconButton>
                </Tooltip>
              )}
            </SelectLanguage>

            <div css={media.mobile({ display: 'none' })}>
              <NavbarSearch inputFieldType="desktopAppbar" />
            </div>
          </Toolbar>
        </AppBar>

        <Drawer
          anchor="top"
          open={searchIsOpen}
          onClose={this.handleSearchClose}
          css={[media.tablet({ display: 'none' })]}
        >
          <NavbarSearch inputFieldType="mobileAppbar" />
        </Drawer>
      </div>
    );
  }
}

export default Navbar;
