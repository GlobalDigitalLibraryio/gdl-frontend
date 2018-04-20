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
import Menu, { MenuItem } from '../Menu';
import { ActivityIndicator } from '../../elements';
import { spacing } from '../../style/theme';

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
          <Menu
            heading={<Trans>Categories</Trans>}
            onClose={this.handleCloseMenu}
            isNestedMenu
          >
            {!categories ? (
              <ActivityIndicator
                size="large"
                style={{ marginTop: spacing.large }}
              />
            ) : (
              (categories.classroom_books && (
                <Fragment>
                  <MenuItem showKeyLine>
                    <Trans>Classroom books</Trans>
                  </MenuItem>
                  {categories.classroom_books.map(level => (
                    <Link
                      key={level}
                      lang={languageCode}
                      readingLevel={level}
                      category="classroom_books"
                    >
                      <MenuItem onCustomClick={onSelectCategory} isNestedItem>
                        <ReadingLevelTrans readingLevel={level} />
                      </MenuItem>
                    </Link>
                  ))}
                  <Link
                    category="classroom_books"
                    lang={languageCode}
                    sort="-arrivalDate"
                  >
                    <MenuItem
                      isNestedItem
                      onCustomClick={onSelectCategory}
                      showKeyLine={Boolean(categories.library_books)}
                    >
                      <Trans>New arrivals</Trans>
                    </MenuItem>
                  </Link>
                </Fragment>
              ),
              categories.library_books && (
                <Fragment>
                  <MenuItem showKeyLine>
                    <Trans>Library books</Trans>
                  </MenuItem>
                  {categories.library_books.map(level => (
                    <Link
                      key={level}
                      lang={languageCode}
                      readingLevel={level}
                      category="library_books"
                    >
                      <MenuItem onCustomClick={onSelectCategory} isNestedItem>
                        <ReadingLevelTrans readingLevel={level} />
                      </MenuItem>
                    </Link>
                  ))}
                  <Link
                    category="library_books"
                    lang={languageCode}
                    sort="-arrivalDate"
                  >
                    <MenuItem onCustomClick={onSelectCategory} isNestedItem>
                      <Trans>New arrivals</Trans>
                    </MenuItem>
                  </Link>
                </Fragment>
              ))
            )}
          </Menu>
        )}
      </Fragment>
    );
  }
}
