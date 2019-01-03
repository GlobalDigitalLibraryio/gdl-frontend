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

import { getBookLanguageCode } from '../../lib/storage';
import type { ReadingLevel } from '../../types';
import { fetchCategories } from '../../fetch';
import Link from '../BrowseLink';
import ReadingLevelTrans from '../ReadingLevelTrans';

type Props = {|
  children: (data: { onClick: () => void, loading: boolean }) => Node,
  enableParentSwipe: () => void,
  disableParentSwipe: () => void,
  onSelectCategory: () => void
|};

type CategoriesType = {
  classroom_books?: Array<ReadingLevel>,
  library_books?: Array<ReadingLevel>
};

export default class CategoriesMenu extends React.Component<
  Props,
  {
    showMenu: boolean,
    categories: ?'LOADING' | 'ERROR' | CategoriesType,
    languageCode: string
  }
> {
  state = {
    showMenu: false,
    categories: null,
    languageCode: getBookLanguageCode()
  };

  /**
   * We only load the categories if the menu is "open" and we're in an uninitialized state
   */
  componentDidUpdate() {
    if (this.state.showMenu && this.state.categories == null) {
      this.loadCategories();
    }
  }

  loadCategories = async () => {
    this.setState({ categories: 'LOADING' });
    const result = await fetchCategories(this.state.languageCode);

    this.setState({
      categories: result.isOk ? result.data : 'ERROR'
    });
  };

  handleShowMenu = () => {
    this.setState({ showMenu: true });
    this.props.disableParentSwipe();
  };

  handleCloseMenu = () => {
    this.setState({ showMenu: false });
    this.props.enableParentSwipe();
  };

  render() {
    const { children, onSelectCategory } = this.props;
    const { categories, showMenu, languageCode } = this.state;
    return (
      <>
        {children({
          onClick: this.handleShowMenu,
          loading: categories === 'LOADING'
        })}
        <SwipeableDrawer
          disableDiscovery
          disableSwipeToOpen
          disableBackdropTransition
          open={showMenu && categories !== 'LOADING'}
          onOpen={() => {}}
          onClose={this.handleCloseMenu}
        >
          {categories === 'ERROR' && (
            <Typography component="span" color="error" css={{ margin: '1rem' }}>
              <Trans>Error loading data.</Trans>
            </Typography>
          )}

          {categories && categories !== 'LOADING' && categories !== 'ERROR' && (
            <Categories
              onSelectCategory={onSelectCategory}
              categories={categories}
              languageCode={languageCode}
            />
          )}
        </SwipeableDrawer>
      </>
    );
  }
}

const Categories = ({ categories, onSelectCategory, languageCode }) => (
  <List component="nav">
    {categories.classroom_books && (
      <>
        <ListSubheader component="div">
          <Trans>Classroom books</Trans>
        </ListSubheader>
        <Link
          category="classroom_books"
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
        {categories.classroom_books.map(level => (
          <Link
            key={level}
            lang={languageCode}
            readingLevel={level}
            category="classroom_books"
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

    {Boolean(categories.library_books) &&
      Boolean(categories.classroom_books) && <Divider />}

    {categories.library_books && (
      <>
        <ListSubheader component="div">
          <Trans>Library books</Trans>
        </ListSubheader>
        <Link
          category="library_books"
          lang={languageCode}
          sort="-arrivalDate"
          passHref
        >
          <ListItem button onClick={onSelectCategory} component="a">
            <ListItemText inset>
              <Trans>New arrivals</Trans>
            </ListItemText>
          </ListItem>
        </Link>
        {categories.library_books.map(level => (
          <Link
            key={level}
            lang={languageCode}
            readingLevel={level}
            category="library_books"
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
