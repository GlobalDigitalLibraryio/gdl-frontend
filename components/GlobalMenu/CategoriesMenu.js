// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */

import React from 'react';
import { Trans } from '@lingui/react';

import type { Language } from '../../types';
import { Link } from '../../routes';
import Menu, { MenuItem } from '../Menuu';

type Props = {
  levels: Array<string>,
  language: Language,
  onClose: (
    event: SyntheticMouseEvent<any> | SyntheticKeyboardEvent<any>
  ) => void
};

export default class CategoriesMenu extends React.Component<Props> {
  render() {
    const { levels, onClose, language } = this.props;
    return (
      <Menu heading={<Trans>Categories</Trans>} onClose={onClose} isNestedMenu>
        {levels.map(level => (
          <Link
            key={level}
            route="level"
            passHref
            params={{ lang: language.code, level }}
          >
            <MenuItem onCustomClick={onClose}>
              <Trans>Reading level {level}</Trans>
            </MenuItem>
          </Link>
        ))}
        <Link route="new" passHref params={{ lang: language.code }}>
          <MenuItem onCustomClick={onClose}>
            <Trans>New arrivals</Trans>
          </MenuItem>
        </Link>
      </Menu>
    );
  }
}
