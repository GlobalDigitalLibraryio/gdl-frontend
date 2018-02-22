// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import React, { type Node } from 'react';
import { MdCheck, MdKeyboardArrowRight } from 'react-icons/lib/md';
import { cx } from 'react-emotion';

import { Item, ItemIcon, itemActionStyle } from './styled/Content';

type Props = {
  isSelected?: boolean,
  showKeyLine?: boolean,
  href?: string,
  onClick?: (event: SyntheticMouseEvent<any>) => void,
  hasNestedMenu?: boolean,
  children: Node
};

const ItemLink = Item.withComponent('a');

const MenuItem = ({
  isSelected,
  hasNestedMenu,
  showKeyLine,
  children,
  onClick,
  href
}: Props) => {
  const ItemComponent = href ? ItemLink : Item;

  return (
    <ItemComponent
      className={cx({ [itemActionStyle]: href || onClick })}
      onClick={onClick}
      href={href}
      isSelected={isSelected}
      showKeyLine={showKeyLine}
      tabIndex={href ? null : onClick ? '0' : null}
    >
      {isSelected && (
        <ItemIcon aria-hidden>
          <MdCheck />
        </ItemIcon>
      )}
      {children}
      {hasNestedMenu && (
        <ItemIcon aria-hidden>
          <MdKeyboardArrowRight />
        </ItemIcon>
      )}
    </ItemComponent>
  );
};

export default MenuItem;
