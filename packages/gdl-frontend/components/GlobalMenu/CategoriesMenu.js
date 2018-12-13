// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { type Node } from 'react';
import { Trans } from '@lingui/react';
import {
  SwipeableDrawer,
  Divider,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { getBookLanguageCode } from '../../lib/storage';
import Link from '../BrowseLink';
import ReadingLevelTrans from '../ReadingLevelTrans';

type Props = {|
  children: (data: { onClick: () => void, loading: boolean }) => Node,
  onSelectCategory: () => void
|};

const READINGLEVELS_BY_CATEGORIES = gql`
  query catgoryReadingLevels($language: String!) {
    classroom: readingLevels(language: $language, category: Classroom)
    library: readingLevels(language: $language, category: Library)
  }
`;

export default class CategoriesMenu extends React.Component<
  Props,
  {
    showMenu: boolean
  }
> {
  state = {
    showMenu: false
  };

  handleShowMenu = () => this.setState({ showMenu: true });

  handleCloseMenu = () => this.setState({ showMenu: false });

  render() {
    const { children, onSelectCategory } = this.props;
    const { showMenu } = this.state;
    const language = getBookLanguageCode();

    return (
      <Query
        query={READINGLEVELS_BY_CATEGORIES}
        variables={{ language }}
        skip={!showMenu}
      >
        {({ loading, error, data }) => (
          <>
            {children({
              onClick: this.handleShowMenu,
              loading
            })}
            <SwipeableDrawer
              disableDiscovery
              disableSwipeToOpen
              disableBackdropTransition
              open={showMenu && !loading}
              onClose={this.handleCloseMenu}
            >
              {error && (
                <Typography
                  component="span"
                  color="error"
                  css={{ margin: '1rem' }}
                >
                  <Trans>Error loading data.</Trans>
                </Typography>
              )}

              {data && (
                <Categories
                  onSelectCategory={onSelectCategory}
                  categories={data}
                  languageCode={language}
                />
              )}
            </SwipeableDrawer>
          </>
        )}
      </Query>
    );
  }
}

const Categories = ({
  categories: { classroom, library },
  onSelectCategory,
  languageCode
}) => (
  <List component="nav">
    {classroom.length > 0 && (
      <>
        <ListSubheader component="div">
          <Trans>Classroom books</Trans>
        </ListSubheader>
        <Link
          category="Classroom"
          lang={languageCode}
          sort="-arrivalDate"
          passHref
        >
          <ListItem onClick={onSelectCategory} button component="a">
            <ListItemText inset>
              <Trans>New arrivals</Trans>
            </ListItemText>
          </ListItem>
        </Link>
        {classroom.map(level => (
          <Link
            key={level}
            lang={languageCode}
            readingLevel={level}
            category="Classroom"
            passHref
          >
            <ListItem onClick={onSelectCategory} button component="a">
              <ListItemText inset>
                <ReadingLevelTrans readingLevel={level} />
              </ListItemText>
            </ListItem>
          </Link>
        ))}
      </>
    )}

    {library.length > 0 && classroom.length > 0 && <Divider />}

    {library && (
      <>
        <ListSubheader component="div">
          <Trans>Library books</Trans>
        </ListSubheader>
        <Link
          category="Library"
          lang={languageCode}
          sort="-arrivalDate"
          passHref
        >
          <ListItem button component="a" onClick={onSelectCategory}>
            <ListItemText inset>
              <Trans>New arrivals</Trans>
            </ListItemText>
          </ListItem>
        </Link>
        {library.map(level => (
          <Link
            key={level}
            lang={languageCode}
            readingLevel={level}
            category="Library"
            passHref
          >
            <ListItem onClick={onSelectCategory} button component="a">
              <ListItemText inset>
                <ReadingLevelTrans readingLevel={level} />
              </ListItemText>
            </ListItem>
          </Link>
        ))}
      </>
    )}
  </List>
);
