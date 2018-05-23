// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { Fragment, type Node } from 'react';
import { Trans } from '@lingui/react';

import type { ReadingLevel } from '../../types';
import { fetchCategories } from '../../fetch';
import Link from '../BrowseLink';
import ReadingLevelTrans from '../ReadingLevelTrans';
import { ActivityIndicator } from '../../elements';
import { spacing } from '../../style/theme';
import {
  Drawer,
  Divider,
  List,
  ListSubheader,
  ListItem,
  ListItemText
} from '@material-ui/core';

type Categories = {
  classroom_books?: Array<ReadingLevel>,
  library_books?: Array<ReadingLevel>
};

type Props = {|
  languageCode: string,
  // Render prop
  children: (data: { onClick: () => void }) => Node,
  onSelectCategory: () => void,
  openStateCallback: boolean => void
|};

type State = {
  showMenu: boolean,
  categories: ?Categories
};

export default class CategoriesMenu extends React.Component<Props, State> {
  state = {
    categories: null,
    showMenu: false
  };

  handleShowMenu = () => {
    if (!this.state.categories) {
      this.loadCategories();
    }

    this.props.openStateCallback(true);
    this.setState({ showMenu: true });
  };

  handleCloseMenu = () => {
    this.props.openStateCallback(false);
    this.setState({ showMenu: false });
  };

  async loadCategories() {
    const categoriesRes = await fetchCategories(this.props.languageCode);

    // TODO: Handle error case by notifying user?
    if (categoriesRes.isOk) {
      this.setState({
        categories: categoriesRes.data
      });
    }
  }

  render() {
    const { children, onSelectCategory, languageCode } = this.props;
    const { categories } = this.state;
    return (
      <Fragment>
        {children({ onClick: this.handleShowMenu })}
        {this.state.showMenu && (
          <Drawer
            open
            heading={<Trans>Categories</Trans>}
            onClose={this.handleCloseMenu}
          >
            <List
              component="nav"
              subheader={
                <ListSubheader component="div">Categories</ListSubheader>
              }
            >
              {!categories ? (
                <ActivityIndicator
                  size="large"
                  style={{ marginTop: spacing.large }}
                />
              ) : (
                <Fragment>
                  {categories.classroom_books && (
                    <Fragment>
                      <ListItem>
                        <ListItemText>
                          <Trans>Classroom books</Trans>
                        </ListItemText>
                      </ListItem>
                      {categories.classroom_books.map(level => (
                        <Link
                          key={level}
                          lang={languageCode}
                          readingLevel={level}
                          category="classroom_books"
                          passHref
                        >
                          <ListItem
                            onCustomClick={onSelectCategory}
                            button
                            component="a"
                          >
                            <ListItemText inset>
                              <ReadingLevelTrans readingLevel={level} />
                            </ListItemText>
                          </ListItem>
                        </Link>
                      ))}
                      <Link
                        category="classroom_books"
                        lang={languageCode}
                        sort="-arrivalDate"
                        passHref
                      >
                        <ListItem
                          onCustomClick={onSelectCategory}
                          button
                          component="a"
                        >
                          <ListItemText inset>
                            <Trans>New arrivals</Trans>
                          </ListItemText>
                        </ListItem>
                      </Link>
                    </Fragment>
                  )}

                  {Boolean(categories.library_books) &&
                    Boolean(categories.classroom_books) && <Divider />}

                  {categories.library_books && (
                    <Fragment>
                      <ListItem>
                        <ListItemText>
                          <Trans>Library books</Trans>
                        </ListItemText>
                      </ListItem>
                      {categories.library_books.map(level => (
                        <Link
                          key={level}
                          lang={languageCode}
                          readingLevel={level}
                          category="library_books"
                        >
                          <ListItem
                            onCustomClick={onSelectCategory}
                            button
                            component="a"
                            inset
                          >
                            <ListItemText inset>
                              <ReadingLevelTrans readingLevel={level} />
                            </ListItemText>
                          </ListItem>
                        </Link>
                      ))}
                      <Link
                        category="library_books"
                        lang={languageCode}
                        sort="-arrivalDate"
                      >
                        <ListItem button onCustomClick={onSelectCategory}>
                          <ListItemText inset>
                            <Trans>New arrivals</Trans>
                          </ListItemText>
                        </ListItem>
                      </Link>
                    </Fragment>
                  )}
                </Fragment>
              )}
            </List>
          </Drawer>
        )}
      </Fragment>
    );
  }
}
