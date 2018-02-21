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
  children: Node
};

const MenuItem = ({ isSelected, showKeyLine, children }: Props) => (
  <Item isSelected={isSelected} showKeyLine={showKeyLine}>
    {isSelected && (
      <ItemIcon>
        <MdCheck />
      </ItemIcon>
    )}
    {children}
  </Item>
);

export default MenuItem;
