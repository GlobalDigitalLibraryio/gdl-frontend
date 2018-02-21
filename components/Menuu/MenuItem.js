// @flow
/**
 * Part of GDL gdl-frontend.
 * Copyright (C) 2018 GDL
 *
 * See LICENSE
 */
import React, { type Node } from 'react';
import { MdCheck } from 'react-icons/lib/md';

import { Item, ItemIcon } from './styled/Content';

type Props = {
  isSelected?: boolean,
  showKeyLine?: boolean,
  href?: string,
  onClick?: (event: SyntheticMouseEvent<any>) => void,
  children: Node
};

const ItemLink = Item.withComponent('a');

const MenuItem = ({
  isSelected,
  showKeyLine,
  children,
  onClick,
  href
}: Props) => {
  const ItemComponent = href ? ItemLink : Item;

  return (
    <ItemComponent
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
    </ItemComponent>
  );
};

export default MenuItem;
