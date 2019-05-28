// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Link from 'next/link';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  SwipeableDrawer
} from '@material-ui/core';
import {
  KeyboardArrowRight as KeyboardArrowRightIcon,
  ExitToApp as ExitToAppIcon,
  Translate as TranslateIcon,
  Edit as EditIcon
} from '@material-ui/icons';
import { hasAuthToken } from 'gdl-auth';

import { FavoriteIcon } from '../Favorite';
import { OfflineIcon } from '../Offline';
import { QueryIsAdmin } from '../../gql';
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
  swipeDisabled: boolean
};

class GlobalMenu extends React.Component<Props, State> {
  state = {
    swipeDisabled: false
  };

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      this.props.isOpen !== nextProps.isOpen ||
      this.state.swipeDisabled !== nextState.swipeDisabled
    );
  }

  static contextType = OnlineStatusContext;

  disableSwipe = () => this.setState({ swipeDisabled: true });
  enableSwipe = () => this.setState({ swipeDisabled: false });

  render() {
    const { onClose } = this.props;
    const online: boolean = this.context;
    return (
      <SwipeableDrawer
        disableDiscovery
        disableSwipeToOpen
        disableBackdropTransition
        onOpen={() => {}}
        PaperProps={{
          style: {
            // By setting variant="temporary" a borde right is applied. Which is why it setting it to "inherit" removes it
            borderRight: 'inherit'
          }
        }}
        variant={this.state.swipeDisabled ? null : 'temporary'}
        open={this.props.isOpen}
        onClose={onClose}
      >
        <List data-cy="global-menu">
          {online && (
            <>
              <SelectBookLanguage
                onSelectLanguage={onClose}
                disableParentSwipe={this.disableSwipe}
                enableParentSwipe={this.enableSwipe}
              >
                {({ onClick, loading }) => (
                  <ListItem button onClick={onClick}>
                    <ListItemText>
                      <FormattedMessage
                        id="Book language"
                        defaultMessage="Book language"
                      />
                    </ListItemText>
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <KeyboardArrowRightIcon />
                    )}
                  </ListItem>
                )}
              </SelectBookLanguage>
              <CategoriesMenu
                onSelectCategory={onClose}
                disableParentSwipe={this.disableSwipe}
                enableParentSwipe={this.enableSwipe}
              >
                {({ onClick, loading }) => (
                  <ListItem button onClick={onClick}>
                    <ListItemText>
                      <FormattedMessage
                        id="Categories"
                        defaultMessage="Categories"
                      />
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
              <RouteLink passHref route="favorites">
                <ListItem
                  button
                  component="a"
                  data-cy="global-menu-favorite-button"
                >
                  <ListItemIcon>
                    <FavoriteIcon filled />
                  </ListItemIcon>
                  <ListItemText>
                    <FormattedMessage
                      id="Favorites"
                      defaultMessage="Favorites"
                    />
                  </ListItemText>
                </ListItem>
              </RouteLink>
            </>
          )}
          {offlineLibrary && (
            <RouteLink passHref route="offline">
              <ListItem
                button
                component="a"
                data-cy="global-menu-offline-button"
              >
                <ListItemIcon>
                  <OfflineIcon filled />
                </ListItemIcon>
                <ListItemText>
                  <FormattedMessage
                    id="Offline library"
                    defaultMessage="Offline library"
                  />
                </ListItemText>
              </ListItem>
            </RouteLink>
          )}
          {online && (
            <>
              <RouteLink passHref route="translations">
                <ListItem
                  button
                  component="a"
                  data-cy="global-menu-translation-button"
                >
                  <ListItemIcon>
                    <TranslateIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <FormattedMessage
                      id="My translations"
                      defaultMessage="My translations"
                    />
                  </ListItemText>
                </ListItem>
              </RouteLink>
              <QueryIsAdmin skip={!this.props.isOpen}>
                {({ isAdmin }) =>
                  isAdmin && (
                    <ListItem component="a" href="/admin" button>
                      <ListItemIcon>
                        <EditIcon />
                      </ListItemIcon>
                      <ListItemText>
                        <FormattedMessage
                          id="GDL Admin"
                          defaultMessage="GDL Admin"
                        />
                      </ListItemText>
                    </ListItem>
                  )
                }
              </QueryIsAdmin>
              {hasAuthToken() ? (
                <Link passHref href="/auth/sign-off">
                  <ListItem button component="a">
                    <ListItemIcon>
                      <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText>
                      <FormattedMessage id="Log out" defaultMessage="Log out" />
                    </ListItemText>
                  </ListItem>
                </Link>
              ) : (
                <Link passHref href="/auth/sign-in">
                  <ListItem
                    button
                    component="a"
                    data-cy="global-menu-login-button"
                  >
                    <ListItemIcon>
                      <ExitToAppIcon css={{ transform: 'rotate(180deg)' }} />
                    </ListItemIcon>
                    <ListItemText>
                      <FormattedMessage id="Log in" defaultMessage="Log in" />
                    </ListItemText>
                  </ListItem>
                </Link>
              )}
            </>
          )}
        </List>
      </SwipeableDrawer>
    );
  }
}

export default GlobalMenu;
