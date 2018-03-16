// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React, { Fragment } from 'react';
import { Trans } from '@lingui/react';

import type { Language } from '../../types';
import type { Categories } from './index';
import Link from '../BrowseLink';
import Menu, { MenuItem } from '../Menu';

type Props = {|
  categories: Categories,
  language: Language,
  onClose: (
    event: | SyntheticMouseEvent<any>
    | SyntheticKeyboardEvent<any>
    | KeyboardEvent
  ) => void
|};

export default class CategoriesMenu extends React.Component<Props> {
  render() {
    const { categories, onClose, language } = this.props;
    return (
      <Menu heading={<Trans>Categories</Trans>} onClose={onClose} isNestedMenu>
        {categories.classroom_books && (
          <Fragment>
            <MenuItem showKeyLine>
              <Trans>Classroom books</Trans>
            </MenuItem>
            {categories.classroom_books.readingLevels.map(level => (
              <Link
                key={level}
                lang={language.code}
                readingLevel={level}
                category="classroom_books"
              >
                <MenuItem onCustomClick={onClose}>
                  <Trans>Reading level {level}</Trans>
                </MenuItem>
              </Link>
            ))}
            <Link
              category="classroom_books"
              lang={language.code}
              sort="-arrivalDate"
            >
              <MenuItem
                onCustomClick={onClose}
                showKeyLine={Boolean(categories.library_books)}
              >
                <Trans>New arrivals</Trans>
              </MenuItem>
            </Link>
          </Fragment>
        )}

        {categories.library_books && (
          <Fragment>
            <MenuItem showKeyLine>
              <Trans>Library books</Trans>
            </MenuItem>
            {categories.library_books.readingLevels.map(level => (
              <Link
                key={level}
                lang={language.code}
                readingLevel={level}
                category="library_books"
              >
                <MenuItem onCustomClick={onClose}>
                  <Trans>Reading level {level}</Trans>
                </MenuItem>
              </Link>
            ))}
            <Link
              category="library_books"
              lang={language.code}
              sort="-arrivalDate"
            >
              <MenuItem onCustomClick={onClose}>
                <Trans>New arrivals</Trans>
              </MenuItem>
            </Link>
          </Fragment>
        )}
      </Menu>
    );
  }
}
