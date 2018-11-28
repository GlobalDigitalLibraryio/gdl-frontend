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
  CheckCircle as CheckCircleIcon,
  Home as HomeIcon
} from '@material-ui/icons';
import { hasClaim, claims, hasAuthToken } from 'gdl-auth';

import { Link as RouteLink } from '../../routes';
import OnlineStatusContext from '../OnlineStatusContext';
import SelectBookLanguage from './SelectBookLanguage';
import CategoriesMenu from './CategoriesMenu';
import offlineLibrary from '../../lib/offlineLibrary';

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

  static contextType = OnlineStatusContext;

  componentDidMount() {
    this.setState({ userHasAdminPrivileges: hasClaim(claims.readAdmin) });
  }

  render() {
    const { onClose } = this.props;
    const online: boolean = this.context;

    return (
      <Drawer open={this.props.isOpen} onClose={onClose}>
        <List>
          {online && (
            <>
              <Link route="books" passHref>
                <ListItem button component="a">
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <Trans>ផ្ទះ</Trans>
                  </ListItemText>
                </ListItem>
              </Link>
              <Divider />
              <SelectBookLanguage onSelectLanguage={onClose}>
                {({ onClick, loading }) => (
                  <ListItem button onClick={onClick}>
                    <ListItemText>
                      <Trans>ភាសាសៀវភៅ</Trans>
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
                      <Trans>ប្រភេទ</Trans>
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
                    <FavoriteIcon style={{ color: 'red' }} />
                  </ListItemIcon>
                  <ListItemText>
                    <Trans>សំណព្វ</Trans>
                  </ListItemText>
                </ListItem>
              </RouteLink>
            </>
          )}
          {offlineLibrary && (
            <RouteLink passHref route="offline">
              <ListItem button component="a">
                <ListItemIcon>
                  <CheckCircleIcon style={{ color: 'green' }} />
                </ListItemIcon>
                <ListItemText>
                  <Trans>បណ្ណាល័យក្រៅបណ្តាញ</Trans>
                </ListItemText>
              </ListItem>
            </RouteLink>
          )}
          {online && (
            <>
              <RouteLink passHref route="translations">
                <ListItem button component="a">
                  <ListItemIcon>
                    <TranslateIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <Trans>ការបកប្រែរបស់ខ្ញុំ</Trans>
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
                      <Trans>ចូល</Trans>
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
            </>
          )}
        </List>
      </Drawer>
    );
  }
}

export default GlobalMenu;
