// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { Trans } from '@lingui/react';
import Link from 'next/link';
import {
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress
} from '@material-ui/core';
import {
  KeyboardArrowRight as KeyboardArrowRightIcon,
  ExitToApp as ExitToAppIcon,
  Translate as TranslateIcon,
  Edit as EditIcon,
  Favorite as FavoriteIcon,
  CheckCircle as CheckCircleIcon
} from '@material-ui/icons';

import { hasClaim, claims, hasAuthToken } from 'gdl-auth';
import { Link as RouteLink } from '../../routes';
import SelectBookLanguage from './SelectBookLanguage';
import CategoriesMenu from './CategoriesMenu';
import { clientSupportsOffline } from '../../lib/offlineLibrary';

type Props = {|
  onClose(): void,
  isOpen: boolean
|};

type State = {
  userHasAdminPrivileges: boolean
};

class GlobalMenu extends React.Component<Props, State> {
  state = {
    userHasAdminPrivileges: false
  };

  componentDidMount() {
    this.setState({ userHasAdminPrivileges: hasClaim(claims.readAdmin) });
  }

  render() {
    const { onClose } = this.props;

    return (
      <Drawer open={this.props.isOpen} onClose={onClose}>
        <List>
          <SelectBookLanguage onSelectLanguage={onClose}>
            {({ onClick, loading }) => (
              <ListItem button onClick={onClick}>
                <ListItemText>
                  <Trans>Book language</Trans>
                </ListItemText>
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  <KeyboardArrowRightIcon />
                )}
              </ListItem>
            )}
          </SelectBookLanguage>
          <CategoriesMenu onSelectCategory={onClose}>
            {({ onClick, loading }) => (
              <ListItem button onClick={onClick}>
                <ListItemText>
                  <Trans>Categories</Trans>
                </ListItemText>
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  <KeyboardArrowRightIcon />
                )}
              </ListItem>
            )}
          </CategoriesMenu>
          <Divider />
          {this.state.userHasAdminPrivileges && (
            <ListItem component="a" href="/admin" button>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText>
                <Trans>GDL Admin</Trans>
              </ListItemText>
            </ListItem>
          )}
          <RouteLink passHref route="favorites">
            <ListItem button component="a">
              <ListItemIcon>
                <FavoriteIcon />
              </ListItemIcon>
              <ListItemText>
                <Trans>Favorites</Trans>
              </ListItemText>
            </ListItem>
          </RouteLink>
          {clientSupportsOffline() && (
            <RouteLink passHref route="offline">
              <ListItem button component="a">
                <ListItemIcon>
                  <CheckCircleIcon />
                </ListItemIcon>
                <ListItemText>
                  <Trans>Offline books</Trans>
                </ListItemText>
              </ListItem>
            </RouteLink>
          )}
          <RouteLink passHref route="translations">
            <ListItem button component="a">
              <ListItemIcon>
                <TranslateIcon />
              </ListItemIcon>
              <ListItemText>
                <Trans>My translations</Trans>
              </ListItemText>
            </ListItem>
          </RouteLink>
          {!hasAuthToken() ? (
            <Link passHref href="/auth/sign-in">
              <ListItem button component="a">
                <ListItemIcon>
                  <ExitToAppIcon css={{ transform: 'rotate(180deg)' }} />
                </ListItemIcon>
                <ListItemText>
                  <Trans>Log in</Trans>
                </ListItemText>
              </ListItem>
            </Link>
          ) : (
            <Link passHref href="/auth/sign-off">
              <ListItem button component="a">
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText>
                  <Trans>Log out</Trans>
                </ListItemText>
              </ListItem>
            </Link>
          )}
        </List>
      </Drawer>
    );
  }
}

export default GlobalMenu;
